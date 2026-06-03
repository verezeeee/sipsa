// Dengue Forecasting API — http://localhost:8000
const API_BASE = "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────

export interface DengueCaseOut {
  neighborhood_id: number;
  week_start: string;
  iso_year: number;
  iso_week: number;
  case_count: number | null;
}

export interface DengueCaseSeriesOut {
  neighborhood_id: number;
  neighborhood_name: string;
  series: DengueCaseOut[];
}

export interface OvitrapReadingOut {
  neighborhood_id: number;
  week_start: string;
  iso_year: number;
  iso_week: number;
  opi: number | null;
  edi: number | null;
}

export interface OvitrapSeriesOut {
  neighborhood_id: number;
  neighborhood_name: string;
  series: OvitrapReadingOut[];
}

export interface PredictionPointOut {
  week_start: string;
  iso_year: number;
  iso_week: number;
  predicted_cases: number;
  lower_bound: number | null;
  upper_bound: number | null;
}

export interface PredictionOut {
  neighborhood_id: number;
  neighborhood_name: string;
  input_type: string;
  lag: number;
  model_version: string;
  generated_at: string;
  risk_level: string;
  series: PredictionPointOut[];
}

// Known neighborhoods in Natal, RN — with verified coordinates
export const NEIGHBORHOODS: { id: number; name: string; lat: number; lng: number }[] = [
  { id: 1,  name: "Alecrim",                        lat: -5.7996,  lng: -35.2091 },
  { id: 2,  name: "Bom Pastor",                     lat: -5.8221,  lng: -35.2498 },
  { id: 3,  name: "Cidade Alta",                    lat: -5.7940,  lng: -35.2108 },
  { id: 4,  name: "Cidade Nova",                    lat: -5.8359,  lng: -35.2387 },
  { id: 5,  name: "Dix-sept Rosado",                lat: -5.8010,  lng: -35.2480 },
  { id: 6,  name: "Felipe Camarão",                 lat: -5.8503,  lng: -35.2601 },
  { id: 7,  name: "Lagoa Nova",                     lat: -5.8217,  lng: -35.2163 },
  { id: 8,  name: "Lagoa Seca",                     lat: -5.8077,  lng: -35.2315 },
  { id: 9,  name: "Mãe Luíza",                      lat: -5.7870,  lng: -35.1943 },
  { id: 10, name: "Nazaré",                         lat: -5.8150,  lng: -35.2230 },
  { id: 11, name: "Neópolis",                       lat: -5.8263,  lng: -35.2104 },
  { id: 12, name: "Nossa Sra. da Apresentação",     lat: -5.7730,  lng: -35.2563 },
  { id: 13, name: "Nossa Sra. de Nazaré",           lat: -5.8085,  lng: -35.2416 },
  { id: 14, name: "Pitimbu",                        lat: -5.8441,  lng: -35.2192 },
  { id: 15, name: "Potengi",                        lat: -5.7690,  lng: -35.2413 },
  { id: 16, name: "Quintas",                        lat: -5.8054,  lng: -35.2355 },
  { id: 17, name: "Redinha",                        lat: -5.7378,  lng: -35.2178 },
  { id: 18, name: "Rocas",                          lat: -5.7946,  lng: -35.1980 },
  { id: 19, name: "Santos Reis",                    lat: -5.7882,  lng: -35.2043 },
  { id: 20, name: "Tirol",                          lat: -5.8145,  lng: -35.2063 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Endpoints ────────────────────────────────────────────────────────────────

/** Weekly confirmed dengue case counts for a neighbourhood. */
export async function getCasos(
  neighborhoodId: number,
  yearFrom?: number,
  yearTo?: number
): Promise<DengueCaseSeriesOut> {
  const params = new URLSearchParams();
  if (yearFrom) params.set("year_from", String(yearFrom));
  if (yearTo)   params.set("year_to",   String(yearTo));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<DengueCaseSeriesOut>(`/casos/${neighborhoodId}${qs}`);
}

/** Fetch case totals for every neighbourhood in parallel (for the map). */
export interface NeighborhoodSummary {
  id: number;
  name: string;
  lat: number;
  lng: number;
  totalCases: number;
  avgOpi: number;
}

export async function getAllNeighborhoodSummaries(
  year: number
): Promise<NeighborhoodSummary[]> {
  const results = await Promise.allSettled(
    NEIGHBORHOODS.map(async (n) => {
      const data = await getCasos(n.id, year, year);
      const total = data.series.reduce((s, p) => s + (p.case_count ?? 0), 0);
      return { id: n.id, name: n.name, lat: n.lat, lng: n.lng, totalCases: total, avgOpi: 0 };
    })
  );
  return results
    .filter((r): r is PromiseFulfilledResult<NeighborhoodSummary> => r.status === "fulfilled")
    .map((r) => r.value);
}

/** Ovitrap (OPI / EDI) readings for a neighbourhood. */
export async function getOvitrampas(
  neighborhoodId: number,
  yearFrom?: number,
  yearTo?: number
): Promise<OvitrapSeriesOut> {
  const params = new URLSearchParams();
  if (yearFrom) params.set("year_from", String(yearFrom));
  if (yearTo)   params.set("year_to",   String(yearTo));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<OvitrapSeriesOut>(`/ovitrampas/${neighborhoodId}${qs}`);
}

/** LSTM dengue forecast for a neighbourhood. */
export async function getPredicao(
  neighborhoodId: number,
  inputType: "dengue" | "edi" = "dengue",
  lag: 1 | 3 | 4 | 5 | 6 = 1,
  nWeeks: number = 4
): Promise<PredictionOut> {
  const params = new URLSearchParams({
    input_type: inputType,
    lag:     String(lag),
    n_weeks: String(nWeeks),
  });
  return apiFetch<PredictionOut>(`/predicao/${neighborhoodId}?${params.toString()}`);
}
