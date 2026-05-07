import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useAlarmStore } from '@/store/alarmStore';
import type { AlarmPrefs, SunTimes, LightWindow } from '@/utils/types';
import { LIGHT_WINDOW_LABELS } from '@/utils/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_ID_PREFIX = 'golden_hour_alarm_';

async function cancelAllAlarms(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const ours = scheduled.filter((n) =>
    n.identifier.startsWith(NOTIFICATION_ID_PREFIX),
  );
  await Promise.all(ours.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

async function scheduleAlarm(
  key: LightWindow,
  start: Date,
  offsetMinutes: number,
): Promise<void> {
  const fireAt = new Date(start.getTime() - offsetMinutes * 60 * 1000);
  if (fireAt.getTime() <= Date.now()) return;

  const label = LIGHT_WINDOW_LABELS[key];
  const offsetLabel = offsetMinutes > 0 ? ` in ${offsetMinutes} min` : '';

  await Notifications.scheduleNotificationAsync({
    identifier: `${NOTIFICATION_ID_PREFIX}${key}`,
    content: {
      title: `${label}${offsetLabel}`,
      body:  'Time to shoot. Golden light is coming.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireAt,
    },
  });
}

export function useNotifications() {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }, []);

  return { requestPermission };
}

export function useScheduleAlarms(
  sunTimes: SunTimes | null,
  alarmPrefs: AlarmPrefs,
  offsetMinutes: number,
): void {
  useEffect(() => {
    if (!sunTimes) return;

    const sync = async () => {
      await cancelAllAlarms();
      const keys: LightWindow[] = ['morningGolden', 'morningBlue', 'eveningGolden', 'eveningBlue'];
      for (const key of keys) {
        if (alarmPrefs[key]) {
          await scheduleAlarm(key, sunTimes[key].start, offsetMinutes);
        }
      }
    };

    sync();
  }, [sunTimes, alarmPrefs, offsetMinutes]);
}
