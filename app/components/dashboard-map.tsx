"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type { NeighborhoodSummary } from "../lib/api";

// ── Helper: fly to selected neighbourhood ─────────────────────────────────
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const prev = useRef<string>("");
  useEffect(() => {
    const key = `${lat},${lng}`;
    if (key !== prev.current) {
      prev.current = key;
      map.flyTo([lat, lng], 14, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

// ── Color scale ───────────────────────────────────────────────────────────
function bubbleColor(cases: number, max: number): string {
  if (max === 0) return "#94a3b8";
  const ratio = cases / max;
  if (ratio > 0.75) return "#ef4444";
  if (ratio > 0.45) return "#f97316";
  if (ratio > 0.15) return "#eab308";
  return "#22c55e";
}

const LEGEND = [
  { label: "Alto (>75%)",         color: "#ef4444" },
  { label: "Médio-alto (45–75%)", color: "#f97316" },
  { label: "Médio (15–45%)",      color: "#eab308" },
  { label: "Baixo (<15%)",        color: "#22c55e" },
];

// ── Shared marker layer (goes inside any MapContainer) ────────────────────
function MarkerLayer({
  summaries,
  selectedId,
  maxCases,
  selected,
}: {
  summaries: NeighborhoodSummary[];
  selectedId?: number;
  maxCases: number;
  selected?: NeighborhoodSummary;
}) {
  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
      {summaries.map((n) => {
        const isSelected = n.id === selectedId;
        const color = bubbleColor(n.totalCases, maxCases);
        const radius = Math.max(6, Math.sqrt(n.totalCases / maxCases) * 28);
        return (
          <CircleMarker
            key={n.id}
            center={[n.lat, n.lng]}
            radius={isSelected ? radius + 5 : radius}
            pathOptions={{
              color: isSelected ? "#1d4ed8" : color,
              fillColor: color,
              fillOpacity: isSelected ? 0.9 : 0.58,
              weight: isSelected ? 3 : 1.5,
            }}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <p className="font-bold text-gray-800 mb-1">{n.name}</p>
                <p className="text-gray-600">
                  Casos confirmados:{" "}
                  <span className="font-semibold" style={{ color }}>
                    {n.totalCases.toFixed(0)}
                  </span>
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(n.totalCases / maxCases) * 100}%`,
                      background: color,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {((n.totalCases / maxCases) * 100).toFixed(0)}% do bairro mais afetado
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────
interface DashboardMapProps {
  summaries?: NeighborhoodSummary[];
  selectedId?: number;
  loading?: boolean;
}

const NATAL_CENTER: [number, number] = [-5.805, -35.225];
const HEADER_HEIGHT = 56; // px — modal header height

// ── Main component ────────────────────────────────────────────────────────
export default function DashboardMap({
  summaries = [],
  selectedId,
  loading = false,
}: DashboardMapProps) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Escape to close
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  const maxCases = Math.max(...summaries.map((s) => s.totalCases), 1);
  const selected = summaries.find((s) => s.id === selectedId);

  // ── inline (card) ─────────────────────────────────────────────────────
  //
  // The expand button must live OUTSIDE the MapContainer so Leaflet's
  // internal pane z-indices (200-800) can never obscure it.
  // We use a wrapper with `isolation: isolate` to create a new stacking
  // context and give the button a very high z-index within it.
  //
  const inlineMap = (
    <div className="relative w-full h-full" style={{ isolation: "isolate" }}>
      {/* Loading overlay — also outside the MapContainer */}
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl"
          style={{ zIndex: 9000 }}
        >
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Expand button — rendered on top of everything ── */}
      <button
        id="map-expand-btn"
        onClick={() => setExpanded(true)}
        title="Expandir mapa"
        style={{ zIndex: 9000 }}
        className="absolute top-3 right-3 bg-white hover:bg-blue-50 rounded-lg w-9 h-9 flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-gray-200 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#374151"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      {/* Map */}
      <MapContainer
        center={NATAL_CENTER}
        zoom={12}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <MarkerLayer
          summaries={summaries}
          selectedId={selectedId}
          maxCases={maxCases}
          selected={selected}
        />
      </MapContainer>

      {/* Legend — outside MapContainer, always on top */}
      {summaries.length > 0 && (
        <div
          className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs space-y-1 pointer-events-none"
          style={{ zIndex: 9000 }}
        >
          <p className="font-semibold text-gray-600 mb-1">Casos confirmados</p>
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
              <span className="text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* No-data */}
      {!loading && summaries.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl"
          style={{ zIndex: 9000 }}
        >
          <p className="text-sm text-gray-500">Sem dados para exibir</p>
        </div>
      )}
    </div>
  );

  // ── modal (portal) ────────────────────────────────────────────────────
  //
  // Layout: flex-column inside the panel.
  //   Row 1 → header bar (fixed height = HEADER_HEIGHT px)
  //   Row 2 → map fills the remaining height (flex-1)
  //
  // This ensures Leaflet's zoom controls appear inside the map area,
  // never behind or on top of the header bar.
  //
  const modal =
    mounted && expanded
      ? createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 99999, animation: "mapFadeIn 0.2s ease" }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
            />

            {/* Panel */}
            <div
              className="relative w-[96vw] h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ animation: "mapScaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              {/* ── Header (Row 1) ── */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-5 bg-white border-b border-gray-200"
                style={{ height: HEADER_HEIGHT, zIndex: 10 }}
              >
                <div>
                  <h2 className="font-semibold text-gray-800 text-base">
                    Mapa de Casos — Natal, RN
                  </h2>
                  {summaries.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {summaries.length} bairros · clique em uma bolha para detalhes
                    </p>
                  )}
                </div>

                <button
                  id="map-close-btn"
                  onClick={() => setExpanded(false)}
                  title="Fechar mapa"
                  className="bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-lg w-9 h-9 flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* ── Map (Row 2) — fills remaining height ── */}
              <div className="flex-1 relative" style={{ minHeight: 0 }}>
                <MapContainer
                  center={selected ? [selected.lat, selected.lng] : NATAL_CENTER}
                  zoom={selected ? 14 : 12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                  zoomControl={true}
                >
                  <MarkerLayer
                    summaries={summaries}
                    selectedId={selectedId}
                    maxCases={maxCases}
                    selected={selected}
                  />
                </MapContainer>

                {/* Legend inside the map area */}
                {summaries.length > 0 && (
                  <div
                    className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg text-xs space-y-1.5 pointer-events-none"
                    style={{ zIndex: 9000 }}
                  >
                    <p className="font-semibold text-gray-700 mb-1.5">Casos confirmados</p>
                    {LEGEND.map((l) => (
                      <div key={l.label} className="flex items-center gap-2">
                        <span
                          className="inline-block w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ background: l.color }}
                        />
                        <span className="text-gray-500">{l.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Keyboard hint */}
                <div
                  className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-gray-400 pointer-events-none"
                  style={{ zIndex: 9000 }}
                >
                  Pressione{" "}
                  <kbd className="bg-gray-100 rounded px-1 py-0.5 font-mono text-gray-600 text-xs">
                    Esc
                  </kbd>{" "}
                  para fechar
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <style>{`
        @keyframes mapFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mapScaleIn { from { opacity: 0; transform: scale(0.94) } to { opacity: 1; transform: scale(1) } }
      `}</style>
      {inlineMap}
      {modal}
    </>
  );
}
