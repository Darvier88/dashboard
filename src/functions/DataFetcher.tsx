import { useState, useEffect } from "react";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

export interface DataFetcherResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION_MINUTES = 10;

const DataFetcher = (lat: number, lon: number): DataFetcherResult => {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;
  const cacheKey = `weatherData_${lat}_${lon}`;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Verifica si hay datos en cache
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          const cachedTime = parsed.timestamp;
          const diffMinutes = (now - cachedTime) / 60000;

          if (diffMinutes < CACHE_DURATION_MINUTES) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
        }

        // Si no hay cache válido, llama a la API
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener los datos de la API");

        const result: OpenMeteoResponse = await response.json();
        setData(result);

        // Guarda en localStorage
        const toCache = {
          data: result,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(toCache));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error desconocido");

        // Si hay datos antiguos en localStorage, se usan como respaldo
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          setData(parsed.data);
        } else {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lon]);

  return { data, loading, error };
};

export default DataFetcher;
