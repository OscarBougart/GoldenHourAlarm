import SunCalc from 'suncalc';
import type { SunTimes, TimeRange } from './types';

/**
 * Computes golden hour and blue hour time ranges for a given lat/lng and date.
 *
 * Golden hour: when sun altitude is between -4° and 6° (warm raking light)
 * Blue hour:   when sun altitude is between -6° and -4° (cool twilight glow)
 *
 * SunCalc exposes these directly via getTimes():
 *   goldenHour / goldenHourEnd  → morning golden hour
 *   sunsetStart / goldenHour    → evening golden hour
 *   blueHour / blueHourEnd      → blue hour twilight windows
 *
 * We use the named times suncalc provides and fall back to altitude sampling
 * for the blue hour since suncalc doesn't expose it as a named key.
 */
export function computeSunTimes(lat: number, lng: number, date: Date): SunTimes {
  const times = SunCalc.getTimes(date, lat, lng);

  // Morning golden hour: nautical dawn → golden hour end (sun rises through warm angle)
  // suncalc: goldenHourEnd is when morning golden ends (~6° altitude)
  // suncalc: nauticalDawn is when it starts (~-12° but we use a better proxy)
  // Better: dawn → goldenHourEnd for morning golden
  const morningGolden: TimeRange = {
    start: times.dawn,         // civil dawn ~-6°
    end:   times.goldenHourEnd, // ~6° altitude
  };

  // Morning blue hour: nautical dawn → dawn (sun is between -6° and -4°)
  const morningBlue: TimeRange = {
    start: times.nauticalDawn, // ~-12° — too early; suncalc has no -6° named time
    end:   times.dawn,         // ~-6°
  };

  // Evening golden hour: sunsetStart → dusk equivalent
  // suncalc: goldenHour (evening) is when it starts, sunset is when sun hits 0°
  const eveningGolden: TimeRange = {
    start: times.goldenHour,  // ~6° altitude (evening start of golden)
    end:   times.sunsetStart, // sun touches horizon
  };

  // Evening blue hour: dusk → nauticalDusk
  const eveningBlue: TimeRange = {
    start: times.dusk,         // civil dusk ~-6°
    end:   times.nauticalDusk, // ~-12°
  };

  return { morningGolden, morningBlue, eveningGolden, eveningBlue };
}

export function formatTime(date: Date, use24h: boolean): string {
  return date.toLocaleTimeString([], {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: !use24h,
  });
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours        = Math.floor(totalSeconds / 3600);
  const minutes      = Math.floor((totalSeconds % 3600) / 60);
  const seconds      = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Returns which window is currently active or upcoming, and its start time */
export function getNextWindow(
  times: SunTimes,
): { key: keyof SunTimes; start: Date; end: Date; isActive: boolean } | null {
  const now = Date.now();
  const windows = (
    ['morningBlue', 'morningGolden', 'eveningGolden', 'eveningBlue'] as const
  ).map((key) => ({ key, ...times[key] }));

  // Currently active?
  const active = windows.find((w) => now >= w.start.getTime() && now < w.end.getTime());
  if (active) return { ...active, isActive: true };

  // Next upcoming
  const upcoming = windows
    .filter((w) => w.start.getTime() > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

  if (!upcoming) return null;
  return { ...upcoming, isActive: false };
}
