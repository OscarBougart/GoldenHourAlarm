import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import type { AlarmPrefs, AppSettings, LocationData, TimeFormat } from '@/utils/types';

const DEFAULT_ALARM_PREFS: AlarmPrefs = {
  morningGolden: false,
  morningBlue:   false,
  eveningGolden: false,
  eveningBlue:   false,
};

const DEFAULT_SETTINGS: AppSettings = {
  notificationOffsetMinutes: 10,
  timeFormat: '12h',
};

interface AlarmState {
  alarmPrefs:   AlarmPrefs;
  settings:     AppSettings;
  location:     LocationData | null;
  hydrated:     boolean;

  setAlarmPref:   (key: keyof AlarmPrefs, value: boolean) => Promise<void>;
  setSettings:    (patch: Partial<AppSettings>) => Promise<void>;
  setLocation:    (loc: LocationData) => Promise<void>;
  hydrate:        () => Promise<void>;
}

export const useAlarmStore = create<AlarmState>((set, get) => ({
  alarmPrefs: DEFAULT_ALARM_PREFS,
  settings:   DEFAULT_SETTINGS,
  location:   null,
  hydrated:   false,

  hydrate: async () => {
    const [prefs, settings, location] = await Promise.all([
      storage.get<AlarmPrefs>(STORAGE_KEYS.ALARM_PREFS),
      storage.get<AppSettings>(STORAGE_KEYS.ALARM_PREFS + '_settings'),
      storage.get<LocationData>(STORAGE_KEYS.LOCATION),
    ]);
    set({
      alarmPrefs: prefs     ?? DEFAULT_ALARM_PREFS,
      settings:   settings  ?? DEFAULT_SETTINGS,
      location:   location  ?? null,
      hydrated:   true,
    });
  },

  setAlarmPref: async (key, value) => {
    const next = { ...get().alarmPrefs, [key]: value };
    set({ alarmPrefs: next });
    await storage.set(STORAGE_KEYS.ALARM_PREFS, next);
  },

  setSettings: async (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    await storage.set(STORAGE_KEYS.ALARM_PREFS + '_settings', next);
  },

  setLocation: async (loc) => {
    set({ location: loc });
    await storage.set(STORAGE_KEYS.LOCATION, loc);
  },
}));
