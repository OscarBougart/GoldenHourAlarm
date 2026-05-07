import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { useAlarmStore } from '@/store/alarmStore';
import type { LocationData } from '@/utils/types';
import type { CityResult } from '@/hooks/useCitySearch';

interface UseLocationReturn {
  location:        LocationData | null;
  loading:         boolean;
  error:           string | null;
  requestLocation: () => Promise<void>;
  setManualCity:   (city: CityResult) => Promise<void>;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (results.length > 0) {
      const r = results[0];
      return r.city ?? r.region ?? r.country ?? 'Unknown Location';
    }
  } catch {
    // fall through
  }
  return 'Unknown Location';
}

export function useLocation(): UseLocationReturn {
  const storeLocation = useAlarmStore((s) => s.location);
  const setLocation   = useAlarmStore((s) => s.setLocation);
  const hydrated      = useAlarmStore((s) => s.hydrated);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // GPS auto-detect — always overwrites with real coords
  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please enable it in Settings.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = pos.coords;
      const cityName = await reverseGeocode(latitude, longitude);
      await setLocation({ latitude, longitude, cityName });
    } catch {
      setError('Could not get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  // Manual city — user-chosen, persisted; GPS won't auto-overwrite unless user taps detect
  const setManualCity = useCallback(async (city: CityResult) => {
    await setLocation({
      latitude:  city.latitude,
      longitude: city.longitude,
      cityName:  city.city,
    });
  }, [setLocation]);

  // Auto-fetch on first launch only when there's no cached location at all
  useEffect(() => {
    if (hydrated && storeLocation === null) {
      requestLocation();
    }
  }, [hydrated, storeLocation, requestLocation]);

  return {
    location:        storeLocation,
    loading,
    error,
    requestLocation,
    setManualCity,
  };
}
