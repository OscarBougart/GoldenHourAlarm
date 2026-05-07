import { useMemo } from 'react';
import { computeSunTimes } from '@/utils/sunCalc';
import type { SunTimes, LocationData } from '@/utils/types';

export function useSunTimes(location: LocationData | null, date: Date): SunTimes | null {
  return useMemo(() => {
    if (!location) return null;
    return computeSunTimes(location.latitude, location.longitude, date);
  }, [location, date.toDateString()]);
}
