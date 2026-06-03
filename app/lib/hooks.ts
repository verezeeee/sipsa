"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getCasos,
  getOvitrampas,
  getPredicao,
  DengueCaseSeriesOut,
  OvitrapSeriesOut,
  PredictionOut,
} from "./api";

// ── useCasos ────────────────────────────────────────────────────────────────
export function useCasos(
  neighborhoodId: number,
  yearFrom?: number,
  yearTo?: number
) {
  const [data, setData] = useState<DengueCaseSeriesOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCasos(neighborhoodId, yearFrom, yearTo);
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [neighborhoodId, yearFrom, yearTo]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── useOvitrampas ────────────────────────────────────────────────────────────
export function useOvitrampas(
  neighborhoodId: number,
  yearFrom?: number,
  yearTo?: number
) {
  const [data, setData] = useState<OvitrapSeriesOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOvitrampas(neighborhoodId, yearFrom, yearTo);
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [neighborhoodId, yearFrom, yearTo]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── usePredicao ────────────────────────────────────────────────────────────
export function usePredicao(
  neighborhoodId: number,
  inputType: "dengue" | "edi" = "dengue",
  lag: 1 | 3 | 4 | 5 | 6 = 1,
  nWeeks: number = 4
) {
  const [data, setData] = useState<PredictionOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPredicao(neighborhoodId, inputType, lag, nWeeks);
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [neighborhoodId, inputType, lag, nWeeks]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── useAllNeighborhoodSummaries ─────────────────────────────────────────────
import { getAllNeighborhoodSummaries, NeighborhoodSummary } from "./api";

export function useAllNeighborhoodSummaries(year: number) {
  const [data, setData] = useState<NeighborhoodSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllNeighborhoodSummaries(year);
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
