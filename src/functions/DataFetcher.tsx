import { useState, useEffect } from "react";

export interface OpenMeteoResponse {
  // Example fields, adjust according to actual API response
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
  };
  hourly: {
    temperature_2m: number[];
    wind_speed_10m: number[];
    time: string[];
  };
  // Add other fields as needed;
}

export interface DataFetcherResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

const DataFetcher = (lat: number, lon: number): DataFetcherResult => {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
        }
        const result: OpenMeteoResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lon]); // <-- Dependencias

  return { data, loading, error };
};

export default DataFetcher;