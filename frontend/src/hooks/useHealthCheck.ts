import { useState, useEffect, useCallback } from 'react';
import type { BackendHealthResponse } from '../types';

interface HealthCheckState {
  data: BackendHealthResponse | null;
  isLoading: boolean;
  isError: boolean;
  latencyMs: number | null;
  lastChecked: Date | null;
  refetch: () => Promise<void>;
}

export function useHealthCheck(apiUrl: string = 'http://localhost:8000/api/v1/health', pollIntervalMs: number = 15000): HealthCheckState {
  const [data, setData] = useState<BackendHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      const end = performance.now();
      const latency = Math.round(end - start);
      setLatencyMs(latency);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setIsError(false);
      setLastChecked(new Date());
    } catch (err) {
      console.warn('Backend health check poll failed:', err);
      setIsError(true);
      setLastChecked(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchHealth, pollIntervalMs]);

  return {
    data,
    isLoading,
    isError,
    latencyMs,
    lastChecked,
    refetch: fetchHealth,
  };
}
