import { useState, useCallback, useRef } from 'react';

export interface CityResult {
  displayName: string;
  city:        string;
  country:     string;
  latitude:    number;
  longitude:   number;
}

interface UseCitySearchReturn {
  results:  CityResult[];
  loading:  boolean;
  error:    string | null;
  search:   (query: string) => void;
  clear:    () => void;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export function useCitySearch(): UseCitySearchReturn {
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef              = useRef<AbortController | null>(null);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q:              trimmed,
          format:         'json',
          addressdetails: '1',
          limit:          '6',
          featuretype:    'city',
        });

        const res = await fetch(`${NOMINATIM_URL}?${params}`, {
          signal:  abortRef.current.signal,
          headers: { 'Accept-Language': 'en', 'User-Agent': 'GoldenHourAlarm/1.0' },
        });

        if (!res.ok) throw new Error('Network error');

        const data = await res.json() as Array<{
          display_name: string;
          address: { city?: string; town?: string; village?: string; country?: string };
          lat: string;
          lon: string;
        }>;

        const mapped: CityResult[] = data.map((item) => {
          const city =
            item.address.city ??
            item.address.town ??
            item.address.village ??
            item.display_name.split(',')[0];
          return {
            displayName: item.display_name,
            city,
            country:   item.address.country ?? '',
            latitude:  parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          };
        });

        setResults(mapped);
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setError('Could not reach search service. Check your connection.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return { results, loading, error, search, clear };
}
