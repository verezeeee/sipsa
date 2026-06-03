"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import dynamic from "next/dynamic";
import { useCasos, useOvitrampas, usePredicao, useAllNeighborhoodSummaries } from "../lib/hooks";
import { NEIGHBORHOODS } from "../lib/api";

const DashboardMap = dynamic(() => import("../components/dashboard-map"), {
  ssr: false,
});

// ── small helpers ─────────────────────────────────────────────────────────────

const YEARS = [2016, 2017, 2018, 2019];

function riskColor(level: string) {
  const l = level?.toUpperCase() ?? "";
  if (l.includes("ALTO") || l.includes("HIGH")) return "#EF4444";
  if (l.includes("MÉDIO") || l.includes("MODERAT")) return "#F59E0B";
  return "#22C55E";
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full w-full py-8">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorBadge({ msg }: { msg: string }) {
  return (
    <p className="text-xs text-red-400 bg-red-50 rounded px-2 py-1 mt-2">
      Erro: {msg}
    </p>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
const Page = () => {
  const router = useRouter();

  // Selectors
  const [neighborhoodId, setNeighborhoodId] = useState(1);
  const [yearFrom, setYearFrom] = useState<number>(2019);
  const [yearTo, setYearTo] = useState<number>(2019);
  const [nWeeks, setNWeeks] = useState<number>(4);

  // API data
  const casos = useCasos(neighborhoodId, yearFrom, yearTo);
  const ovitrampas = useOvitrampas(neighborhoodId, yearFrom, yearTo);
  const predicao = usePredicao(neighborhoodId, "dengue", 1, nWeeks);
  // Map: all neighbourhoods for the selected start-year
  const allSummaries = useAllNeighborhoodSummaries(yearFrom);

  // Derived – cases chart series
  const casesSeries = useMemo(() => {
    if (!casos.data) return [];
    return casos.data.series.slice(-52).map((p) => ({
      label: `S${p.iso_week}`,
      value: p.case_count ?? 0,
    }));
  }, [casos.data]);

  // Derived – ovitrampas chart series
  const oviSeries = useMemo(() => {
    if (!ovitrampas.data) return [];
    return ovitrampas.data.series.slice(-52).map((p) => ({
      label: `S${p.iso_week}`,
      opi: +(p.opi ?? 0).toFixed(2),
      edi: +(p.edi ?? 0).toFixed(1),
    }));
  }, [ovitrampas.data]);

  // Derived – prediction series
  const predSeries = useMemo(() => {
    if (!predicao.data) return [];
    return predicao.data.series.map((p) => ({
      label: `S${p.iso_week}/${p.iso_year}`,
      predicted: +p.predicted_cases.toFixed(1),
      lower: p.lower_bound != null ? +p.lower_bound.toFixed(1) : undefined,
      upper: p.upper_bound != null ? +p.upper_bound.toFixed(1) : undefined,
    }));
  }, [predicao.data]);

  // Total cases from current fetch
  const totalCases = useMemo(
    () => casos.data?.series.reduce((s, p) => s + (p.case_count ?? 0), 0) ?? 0,
    [casos.data]
  );

  const neighborhoodName =
    NEIGHBORHOODS.find((n) => n.id === neighborhoodId)?.name ?? "—";

  return (
    <div className="bg-[#DFE9FF] min-h-screen w-full p-7">
      {/* TOP NAV */}
      <div className="w-full h-[10%] bg-white rounded-t-3xl flex items-center justify-between px-10 py-8 gap-x-16">
        <Image src="/login/logo.png" alt="Logo" width={100} height={80} />
        <nav className="w-full">
          <ul className="flex space-x-8 text-gray-500">
            <li>
              <a
                href="#"
                className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              >
                Início
              </a>
            </li>
            <li>
              <a className="hover:text-blue-600 opacity-50 pointer-events-none" href="#">
                Mapas
              </a>
            </li>
            <li>
              <a className="hover:text-blue-600 opacity-50 pointer-events-none" href="#">
                Meteorologia
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/relatorios")}
                className="hover:text-blue-600 cursor-pointer"
                href="#"
              >
                Relatórios
              </a>
            </li>
          </ul>
        </nav>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="w-full bg-white px-10 py-4 flex flex-wrap items-center gap-4 border-t border-gray-100">
        {/* Neighbourhood selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Bairro</label>
          <select
            id="neighborhood-select"
            value={neighborhoodId}
            onChange={(e) => setNeighborhoodId(Number(e.target.value))}
            className="bg-[#F3F6FF] rounded-lg px-3 py-2 text-sm text-gray-700 border-none outline-none cursor-pointer"
          >
            {NEIGHBORHOODS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year from */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Ano início</label>
          <select
            id="year-from-select"
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value))}
            className="bg-[#F3F6FF] rounded-lg px-3 py-2 text-sm text-gray-700 border-none outline-none cursor-pointer"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Year to */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Ano fim</label>
          <select
            id="year-to-select"
            value={yearTo}
            onChange={(e) => setYearTo(Number(e.target.value))}
            className="bg-[#F3F6FF] rounded-lg px-3 py-2 text-sm text-gray-700 border-none outline-none cursor-pointer"
          >
            {YEARS.filter((y) => y >= yearFrom).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Prediction horizon */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">
            Horizonte de Previsão (semanas)
          </label>
          <input
            id="n-weeks-input"
            type="number"
            min={1}
            max={12}
            value={nWeeks}
            onChange={(e) =>
              setNWeeks(Math.min(12, Math.max(1, Number(e.target.value))))
            }
            className="bg-[#F3F6FF] rounded-lg px-3 py-2 text-sm text-gray-700 border-none outline-none w-20"
          />
        </div>

        {/* Status badges */}
        <div className="ml-auto flex items-center gap-3">
          {predicao.data && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: riskColor(predicao.data.risk_level) }}
            >
              Risco: {predicao.data.risk_level}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {neighborhoodName} · {yearFrom}–{yearTo}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full rounded-b-3xl p-6 grid grid-cols-3 gap-6 mt-[-2px] bg-[#EAF1FF]">
        {/* LEFT COLUMN */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* SUMMARY CARDS */}
          <div className="bg-[#F6FAFF] rounded-2xl p-5 shadow">
            <h2 className="font-semibold text-gray-700 mb-4">
              Resumo de Casos — {neighborhoodName}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {/* Total */}
              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Confirmados</p>
                  <h3 className="text-3xl font-bold text-blue-600">
                    {casos.loading ? "…" : totalCases.toFixed(0)}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {yearFrom === yearTo ? `${yearFrom}` : `${yearFrom}–${yearTo}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-xs">DN</span>
                </div>
              </div>

              {/* Model Prediction */}
              <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Previsão Próx. Semana</p>
                  <h3 className="text-3xl font-bold text-purple-600">
                    {predicao.loading
                      ? "…"
                      : predicao.error
                      ? "N/A"
                      : predSeries[0]?.predicted ?? "—"}
                  </h3>
                  <p className="text-xs text-gray-400">casos previstos (LSTM)</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-500 font-bold text-xs">IA</span>
                </div>
              </div>

              {/* Risk level */}
              {predicao.data && (
                <div
                  className="rounded-xl p-4 shadow-sm text-white"
                  style={{
                    background: `linear-gradient(135deg, ${riskColor(predicao.data.risk_level)}cc, ${riskColor(predicao.data.risk_level)})`,
                  }}
                >
                  <p className="text-sm opacity-80">Nível de Risco Atual</p>
                  <h3 className="text-2xl font-bold">
                    {predicao.data.risk_level}
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Modelo v{predicao.data.model_version} · lag={predicao.data.lag}
                  </p>
                </div>
              )}
            </div>
            {casos.error && <ErrorBadge msg={casos.error} />}
          </div>

          {/* OVITRAMPAS CARD */}
          <div className="bg-[#F6FAFF] rounded-2xl p-5 shadow flex-1">
            <h2 className="font-semibold text-gray-700 mb-3">
              Ovitrampas (IOP/IDE)
            </h2>
            {ovitrampas.loading ? (
              <Spinner />
            ) : ovitrampas.error ? (
              <ErrorBadge msg={ovitrampas.error} />
            ) : (
              <>
                {/* Latest values */}
                {ovitrampas.data && ovitrampas.data.series.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                      <p className="text-xs text-gray-500">IOP (último)</p>
                      <p className="text-xl font-bold text-teal-600">
                        {(
                          ovitrampas.data.series[
                            ovitrampas.data.series.length - 1
                          ]?.opi ?? 0
                        ).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">0–1</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                      <p className="text-xs text-gray-500">IDE (último)</p>
                      <p className="text-xl font-bold text-orange-500">
                        {(
                          ovitrampas.data.series[
                            ovitrampas.data.series.length - 1
                          ]?.edi ?? 0
                        ).toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-400">ovos/armadilha</p>
                    </div>
                  </div>
                )}
                {/* Mini chart */}
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={oviSeries.slice(-24)}>
                      <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={5} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="opi"
                        stroke="#14B8A6"
                        strokeWidth={2}
                        dot={false}
                        name="IOP"
                      />
                      <Line
                        type="monotone"
                        dataKey="edi"
                        stroke="#F97316"
                        strokeWidth={2}
                        dot={false}
                        name="IDE"
                        yAxisId={1}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* MAPA */}
          <div className="bg-[#F0F4FF] rounded-2xl h-[280px] shadow p-3">
            <DashboardMap
              summaries={allSummaries.data}
              selectedId={neighborhoodId}
              loading={allSummaries.loading}
            />
          </div>

          {/* CONFIRMED CASES CHART */}
          <div className="bg-[#F8FAFF] rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-gray-700 font-semibold">
                Casos Confirmados — {neighborhoodName}
              </h2>
              <span className="text-xs text-gray-400">
                Semanas epidemiológicas
              </span>
            </div>
            {casos.loading ? (
              <Spinner />
            ) : casos.error ? (
              <ErrorBadge msg={casos.error} />
            ) : (
              <div className="w-full h-[200px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={casesSeries}>
                    <defs>
                      <linearGradient id="casesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A6DFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4A6DFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      interval={Math.floor(casesSeries.length / 8)}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4A6DFF"
                      strokeWidth={2.5}
                      fill="url(#casesGrad)"
                      dot={false}
                      name="Casos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* PREDICTION CHART */}
          <div className="bg-[#F8FAFF] rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-gray-700 font-semibold">
                Previsão LSTM — Próximas {nWeeks} semanas
              </h2>
              {predicao.data && (
                <span className="text-xs text-gray-400">
                  Gerado em{" "}
                  {new Date(predicao.data.generated_at).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
            {predicao.loading ? (
              <Spinner />
            ) : predicao.error ? (
              <div className="text-sm text-gray-400 italic mt-2">
                Previsão indisponível no momento — o modelo pode precisar de mais dados.
              </div>
            ) : (
              <div className="w-full h-[180px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predSeries}>
                    <defs>
                      <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    {predSeries[0]?.lower !== undefined && (
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="#A855F7"
                        strokeDasharray="4 4"
                        fill="url(#predGrad)"
                        dot={false}
                        name="Limite Superior"
                        strokeWidth={1}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#A855F7"
                      strokeWidth={2.5}
                      fill="url(#predGrad)"
                      dot={{ r: 4, fill: "#A855F7" }}
                      name="Previsão"
                    />
                    {predSeries[0]?.lower !== undefined && (
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="#A855F7"
                        strokeDasharray="4 4"
                        fill="transparent"
                        dot={false}
                        name="Limite Inferior"
                        strokeWidth={1}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
