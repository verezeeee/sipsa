"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mockRelatorios } from "../mock/mockRelatorios";
import SeasonalityRisk2026 from "../components/SeasonalityRisk2026";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useCasos, usePredicao, useOvitrampas } from "../lib/hooks";
import { NEIGHBORHOODS } from "../lib/api";

const YEARS = [2016, 2017, 2018, 2019];

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full w-full py-8">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function riskColor(level: string) {
  const l = level?.toUpperCase() ?? "";
  if (l.includes("ALTO") || l.includes("HIGH")) return "#EF4444";
  if (l.includes("MÉDIO") || l.includes("MODERAT")) return "#F59E0B";
  return "#22C55E";
}

const Page = () => {
  const router = useRouter();

  const [neighborhoodId, setNeighborhoodId] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2019);

  // API hooks
  const casos = useCasos(neighborhoodId, selectedYear, selectedYear);
  const ovitrampas = useOvitrampas(neighborhoodId, selectedYear, selectedYear);
  const predicao = usePredicao(neighborhoodId, "dengue", 1, 8);

  const neighborhoodName =
    NEIGHBORHOODS.find((n) => n.id === neighborhoodId)?.name ?? "—";

  // Weekly case data for bar chart (last 26 weeks)
  const casosSeries = useMemo(() => {
    if (!casos.data) return [];
    return casos.data.series.slice(-26).map((p) => ({
      semana: `S${p.iso_week}`,
      casos: p.case_count ?? 0,
    }));
  }, [casos.data]);

  // Ovitrampas trend
  const oviSeries = useMemo(() => {
    if (!ovitrampas.data) return [];
    return ovitrampas.data.series.slice(-26).map((p) => ({
      semana: `S${p.iso_week}`,
      opi: +(p.opi ?? 0).toFixed(2),
      edi: +(p.edi ?? 0).toFixed(1),
    }));
  }, [ovitrampas.data]);

  // Prediction series
  const predSeries = useMemo(() => {
    if (!predicao.data) return [];
    return predicao.data.series.map((p) => ({
      semana: `S${p.iso_week}`,
      previsao: +p.predicted_cases.toFixed(1),
    }));
  }, [predicao.data]);

  // Total cases from API
  const totalCases = useMemo(
    () => casos.data?.series.reduce((s, p) => s + (p.case_count ?? 0), 0) ?? 0,
    [casos.data]
  );

  // Peak week
  const peakWeek = useMemo(() => {
    if (!casos.data) return null;
    const sorted = [...casos.data.series].sort(
      (a, b) => (b.case_count ?? 0) - (a.case_count ?? 0)
    );
    return sorted[0] ?? null;
  }, [casos.data]);

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
                onClick={() => router.push("/dashboard")}
                className="hover:text-blue-600"
              >
              Início
              </a>
            </li>
            <li>
              <a
                className="hover:text-blue-600 opacity-50 pointer-events-none"
                href="#"
              >
                Mapas
              </a>
            </li>
            <li>
              <a
                className="hover:text-blue-600 opacity-50 pointer-events-none"
                href="#"
              >
                Meteorologia
              </a>
            </li>
            <li>
              <a
                onClick={() => router.push("/relatorios")}
                className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                href="#"
              >
                Relatórios
              </a>
            </li>
          </ul>
        </nav>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Sair
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="w-full bg-white px-10 py-4 flex flex-wrap items-center gap-4 border-t border-gray-100">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Bairro</label>
          <select
            id="relatorio-neighborhood-select"
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
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Ano</label>
          <select
            id="relatorio-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#F3F6FF] rounded-lg px-3 py-2 text-sm text-gray-700 border-none outline-none cursor-pointer"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Risk badge from prediction */}
        {predicao.data && (
          <div className="ml-auto">
            <span
              className="text-sm font-semibold px-4 py-1.5 rounded-full text-white"
              style={{ background: riskColor(predicao.data.risk_level) }}
            >
              Risco Previsto: {predicao.data.risk_level}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="w-full rounded-b-3xl p-6 grid grid-cols-3 gap-6 mt-[-2px] bg-[#EAF1FF]">

        {/* LEFT 2-col: API sections */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* KPI ROW */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow text-center">
              <p className="text-sm text-gray-500">Total de Casos</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-1">
                {casos.loading ? "…" : totalCases.toFixed(0)}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {neighborhoodName} · {selectedYear}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow text-center">
              <p className="text-sm text-gray-500">Semana de Pico</p>
              <h2 className="text-4xl font-bold text-red-500 mt-1">
                {casos.loading
                  ? "…"
                  : peakWeek
                  ? `S${peakWeek.iso_week}`
                  : "—"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {peakWeek
                  ? `${(peakWeek.case_count ?? 0).toFixed(0)} casos`
                  : "sem dados"}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow text-center">
              <p className="text-sm text-gray-500">Previsão (próx. 8 sem.)</p>
              <h2 className="text-4xl font-bold text-purple-600 mt-1">
                {predicao.loading
                  ? "…"
                  : predicao.error
                  ? "N/A"
                  : predSeries
                      .reduce((s, p) => s + p.previsao, 0)
                      .toFixed(0)}
              </h2>
              <p className="text-xs text-gray-400 mt-1">casos acumulados (LSTM)</p>
            </div>
          </div>

          {/* CONFIRMED CASES BAR CHART */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-4">
              Casos Confirmados por Semana — {neighborhoodName} ({selectedYear})
            </h2>
            {casos.loading ? (
              <Spinner />
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={casosSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="semana" tick={{ fontSize: 10 }} interval={3} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="casos" fill="#4A6DFF" radius={[4, 4, 0, 0]} name="Casos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* PREDICTION CHART */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">
                Previsão LSTM — Próximas 8 Semanas
              </h2>
              {predicao.data && (
                <p className="text-xs text-gray-400">
                  Modelo v{predicao.data.model_version} ·{" "}
                  {new Date(predicao.data.generated_at).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
            {predicao.loading ? (
              <Spinner />
            ) : predicao.error ? (
              <p className="text-sm text-gray-400 italic">
                Previsão indisponível — o modelo pode precisar de dados adicionais.
              </p>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="semana" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="previsao"
                      stroke="#A855F7"
                      strokeWidth={2.5}
                      dot={{ r: 5, fill: "#A855F7" }}
                      name="Casos Previstos (LSTM)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* OVITRAMPAS */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-4">
              Ovitrampas — OPI e EDI ({neighborhoodName}, {selectedYear})
            </h2>
            {ovitrampas.loading ? (
              <Spinner />
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={oviSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="semana" tick={{ fontSize: 10 }} interval={3} />
                    <YAxis yAxisId="opi" tick={{ fontSize: 10 }} domain={[0, 1]} label={{ value: "OPI", angle: -90, position: "insideLeft", fontSize: 10 }} />
                    <YAxis yAxisId="edi" orientation="right" tick={{ fontSize: 10 }} label={{ value: "EDI", angle: 90, position: "insideRight", fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="opi"
                      type="monotone"
                      dataKey="opi"
                      stroke="#14B8A6"
                      strokeWidth={2}
                      dot={false}
                      name="IOP (Índice de Positividade de Ovitrampas)"
                    />
                    <Line
                      yAxisId="edi"
                      type="monotone"
                      dataKey="edi"
                      stroke="#F97316"
                      strokeWidth={2}
                      dot={false}
                      name="IDE (Índice de Densidade de Ovos)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Model performance + seasonality (kept from mock) */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* Risk overview (from mock) */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">Panorama de Riscos</h2>
            <div className="space-y-4">
              {Object.entries(mockRelatorios.riskOverview)
                .filter(([key]) => key !== "metadata")
                .map(([key, value]) => {
                  const risk = value as {
                    score: number;
                    value: number;
                    level: string;
                  };
                  const title = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  const color =
                    risk.level === "ALTO"
                      ? "bg-red-500"
                      : risk.level === "MODERADO"
                      ? "bg-yellow-400"
                      : "bg-green-500";
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm">
                        <span>{title}</span>
                        <span className="font-semibold">
                          {risk.score.toFixed(2)}{" "}
                          <span className="text-xs font-normal text-gray-400">
                            {risk.level}
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`${color} h-2 rounded-full transition-all`}
                          style={{ width: `${risk.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              <p className="text-center text-xs text-gray-400 mt-4">
                Amostra: {mockRelatorios.riskOverview.metadata.amostra} | Confiança:{" "}
                {mockRelatorios.riskOverview.metadata.nivelConfianca}
              </p>
            </div>
          </div>

          {/* Model Performance */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
            <h2 className="font-semibold text-lg mb-4">Desempenho do Modelo</h2>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-blue-600"
                  strokeDasharray={`${mockRelatorios.modelPerformance.acuraciaGlobal * 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-bold">
                  {mockRelatorios.modelPerformance.acuraciaGlobal * 100}%
                </span>
                <p className="text-xs text-gray-600">Acurácia</p>
              </div>
            </div>
            <div className="text-center text-sm mt-4 space-y-1">
              <p>
                Sensibilidade:{" "}
                <span className="font-bold">
                  {mockRelatorios.modelPerformance.sensibilidade * 100}%
                </span>
              </p>
              <p>
                Falsos Negativos:{" "}
                <span className="font-bold">
                  &lt; {mockRelatorios.modelPerformance.falsoNegativos * 100}%
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Atualização: {mockRelatorios.modelPerformance.dataAtualizacao}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Seasonality (full-width) */}
        <div className="col-span-3">
          <SeasonalityRisk2026 />
        </div>
      </div>
    </div>
  );
};

export default Page;