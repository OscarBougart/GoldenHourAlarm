export type LightWindow = 'morningGolden' | 'morningBlue' | 'eveningGolden' | 'eveningBlue';

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SunTimes {
  morningGolden: TimeRange;
  morningBlue: TimeRange;
  eveningGolden: TimeRange;
  eveningBlue: TimeRange;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  cityName: string;
}

export interface AlarmPrefs {
  morningGolden: boolean;
  morningBlue: boolean;
  eveningGolden: boolean;
  eveningBlue: boolean;
}

export type TimeFormat = '12h' | '24h';

export interface AppSettings {
  notificationOffsetMinutes: number;
  timeFormat: TimeFormat;
}

export const LIGHT_WINDOW_LABELS: Record<LightWindow, string> = {
  morningGolden: 'Morning Golden Hour',
  morningBlue:   'Morning Blue Hour',
  eveningGolden: 'Evening Golden Hour',
  eveningBlue:   'Evening Blue Hour',
};
