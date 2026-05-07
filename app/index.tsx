import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAlarmStore } from '@/store/alarmStore';
import { useLocation } from '@/hooks/useLocation';
import { useSunTimes } from '@/hooks/useSunTimes';
import { useCountdown } from '@/hooks/useCountdown';
import { useNotifications, useScheduleAlarms } from '@/hooks/useNotifications';
import { useTheme } from '@/src/theme';
import { SPACE, RADIUS } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import EventRow from '@/components/EventRow';
import CountdownBanner from '@/components/CountdownBanner';
import SunArc from '@/components/SunArc';
import CitySearchModal from '@/components/CitySearchModal';
import type { LightWindow } from '@/utils/types';
import type { CityResult } from '@/hooks/useCitySearch';

const TODAY = new Date();

type Tab = 'morning' | 'evening';

function isMorningDone(now: Date): boolean {
  const h = now.getHours();
  return h >= 12;
}

export default function TodayScreen(): React.JSX.Element {
  const theme    = useTheme();
  const router   = useRouter();
  const { width } = useWindowDimensions();
  const isSmall  = width < 375;
  const styles   = makeStyles(theme, isSmall);

  const alarmPrefs   = useAlarmStore((s) => s.alarmPrefs);
  const settings     = useAlarmStore((s) => s.settings);
  const setAlarmPref = useAlarmStore((s) => s.setAlarmPref);
  const hydrate      = useAlarmStore((s) => s.hydrate);
  const hydrated     = useAlarmStore((s) => s.hydrated);

  const { location, loading: locLoading, error: locError, requestLocation, setManualCity } = useLocation();
  const { requestPermission } = useNotifications();

  const sunTimes  = useSunTimes(location, TODAY);
  const countdown = useCountdown(sunTimes);

  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [tab, setTab] = useState<Tab>(isMorningDone(new Date()) ? 'evening' : 'morning');

  useScheduleAlarms(sunTimes, alarmPrefs, settings.notificationOffsetMinutes);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Auto-switch tab when morning windows are all past
  useEffect(() => {
    const timer = setInterval(() => {
      setTab(isMorningDone(new Date()) ? 'evening' : 'morning');
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  const dateLabel = useMemo(() => {
    return TODAY.toLocaleDateString(undefined, {
      weekday: 'long',
      month:   'long',
      day:     'numeric',
    });
  }, []);

  const countdownIsGolden =
    countdown.key === 'morningGolden' || countdown.key === 'eveningGolden';

  const use24h = settings.timeFormat === '24h';

  const handleCitySelect = async (city: CityResult) => {
    await setManualCity(city);
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  const handleTabPress = (t: Tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTab(t);
  };

  const isActive = (key: LightWindow) => countdown.isActive && countdown.key === key;

  if (!hydrated || (locLoading && !location)) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
        <Text style={styles.loadingText}>Finding your location…</Text>
      </SafeAreaView>
    );
  }

  if (locError && !location) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <Ionicons name="location-outline" size={48} color={theme.textMuted} />
        <Text style={styles.errorTitle}>Location Needed</Text>
        <Text style={styles.errorBody}>{locError}</Text>
        <Pressable
          style={styles.retryBtn}
          onPress={requestLocation}
          accessibilityLabel="Retry location"
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={locLoading}
            onRefresh={requestLocation}
            tintColor={theme.textPrimary}
          />
        }
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.dateText} numberOfLines={1} adjustsFontSizeToFit>
              {dateLabel}
            </Text>
            <Pressable
              style={styles.cityBtn}
              onPress={() => setCityModalVisible(true)}
              accessibilityLabel="Change city"
              accessibilityRole="button"
            >
              <Ionicons name="location-sharp" size={11} color={theme.textSecondary} />
              <Text style={styles.cityText} numberOfLines={1}>
                {location?.cityName ?? 'Set location'}
              </Text>
              <Ionicons name="chevron-down" size={11} color={theme.textMuted} />
            </Pressable>
          </View>

          <Pressable
            style={styles.settingsBtn}
            onPress={handleSettingsPress}
            accessibilityLabel="Open settings"
            accessibilityRole="button"
          >
            <Ionicons name="settings-outline" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>

        {/* ── Sun Arc ────────────────────────────────────────────── */}
        {sunTimes && (
          <SunArc sunrise={sunTimes.sunrise} sunset={sunTimes.sunset} use24h={use24h} />
        )}

        {/* ── Countdown ──────────────────────────────────────────── */}
        {sunTimes && (
          <CountdownBanner
            targetKey={countdown.key}
            msLeft={countdown.msLeft}
            isActive={countdown.isActive}
            isGolden={countdownIsGolden}
          />
        )}

        {/* ── Morning / Evening tabs ──────────────────────────────── */}
        <View style={styles.tabRow}>
          {(['morning', 'evening'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => handleTabPress(t)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
              accessibilityLabel={`${t} events`}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'morning' ? 'Morning' : 'Evening'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Event rows ─────────────────────────────────────────── */}
        {sunTimes ? (
          <View style={styles.eventList}>
            {tab === 'morning' ? (
              <>
                <EventRow
                  variant="blue"
                  label="Blue Hour"
                  timeRange={sunTimes.morningBlue}
                  use24h={use24h}
                  isActive={isActive('morningBlue')}
                  alarmOn={alarmPrefs.morningBlue}
                  lightWindow="morningBlue"
                  onToggleAlarm={(w) => setAlarmPref(w, !alarmPrefs[w])}
                />
                <View style={styles.divider} />
                <EventRow
                  variant="sunrise"
                  label="Sunrise"
                  timeRange={{ start: sunTimes.sunrise, end: sunTimes.sunrise }}
                  use24h={use24h}
                  isActive={false}
                />
                <View style={styles.divider} />
                <EventRow
                  variant="golden"
                  label="Golden Hour"
                  timeRange={sunTimes.morningGolden}
                  use24h={use24h}
                  isActive={isActive('morningGolden')}
                  alarmOn={alarmPrefs.morningGolden}
                  lightWindow="morningGolden"
                  onToggleAlarm={(w) => setAlarmPref(w, !alarmPrefs[w])}
                />
              </>
            ) : (
              <>
                <EventRow
                  variant="golden"
                  label="Golden Hour"
                  timeRange={sunTimes.eveningGolden}
                  use24h={use24h}
                  isActive={isActive('eveningGolden')}
                  alarmOn={alarmPrefs.eveningGolden}
                  lightWindow="eveningGolden"
                  onToggleAlarm={(w) => setAlarmPref(w, !alarmPrefs[w])}
                />
                <View style={styles.divider} />
                <EventRow
                  variant="sunset"
                  label="Sunset"
                  timeRange={{ start: sunTimes.sunset, end: sunTimes.sunset }}
                  use24h={use24h}
                  isActive={false}
                />
                <View style={styles.divider} />
                <EventRow
                  variant="blue"
                  label="Blue Hour"
                  timeRange={sunTimes.eveningBlue}
                  use24h={use24h}
                  isActive={isActive('eveningBlue')}
                  alarmOn={alarmPrefs.eveningBlue}
                  lightWindow="eveningBlue"
                  onToggleAlarm={(w) => setAlarmPref(w, !alarmPrefs[w])}
                />
              </>
            )}
          </View>
        ) : (
          <View style={styles.center}>
            <ActivityIndicator color={theme.textPrimary} />
          </View>
        )}
      </ScrollView>

      <CitySearchModal
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        onSelect={handleCitySelect}
      />
    </SafeAreaView>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>, isSmall: boolean) {
  return StyleSheet.create({
    root: {
      flex:            1,
      backgroundColor: theme.bgPrimary,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: isSmall ? SPACE.MD : SPACE.LG,
      paddingTop:        SPACE.XS,
      gap:               isSmall ? SPACE.MD : SPACE.LG,
      paddingBottom:     SPACE['2XL'] * 2,
    },
    center: {
      flex:           1,
      alignItems:     'center',
      justifyContent: 'center',
      gap:            SPACE.LG,
      padding:        SPACE.XL,
    },
    header: {
      flexDirection:  'row',
      alignItems:     'flex-start',
      justifyContent: 'space-between',
      paddingTop:     SPACE.SM,
      paddingBottom:  SPACE.SM,
    },
    headerLeft: {
      flex:         1,
      gap:          4,
      flexShrink:   1,
      paddingRight: SPACE.SM,
    },
    dateText: {
      fontSize:   isSmall ? FONT_SIZE.LG : FONT_SIZE.XL,
      fontWeight: FONT_WEIGHT.BOLD,
      color:      theme.textPrimary,
    },
    cityBtn: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           4,
      alignSelf:     'flex-start',
    },
    cityText: {
      fontSize:   FONT_SIZE.XS,
      fontWeight: FONT_WEIGHT.MEDIUM,
      color:      theme.textSecondary,
      flexShrink: 1,
    },
    settingsBtn: {
      width:          44,
      height:         44,
      alignItems:     'center',
      justifyContent: 'center',
      flexShrink:     0,
    },
    tabRow: {
      flexDirection: 'row',
      gap:           SPACE.SM,
    },
    tab: {
      flex:            1,
      alignItems:      'center',
      paddingVertical: SPACE.SM,
      borderBottomWidth: 2,
      borderBottomColor: 'rgba(255,255,255,0.20)',
    },
    tabActive: {
      borderBottomColor: '#FFFFFF',
    },
    tabText: {
      fontSize:   FONT_SIZE.MD,
      fontWeight: FONT_WEIGHT.BOLD,
      color:      'rgba(255,255,255,0.45)',
    },
    tabTextActive: {
      color: '#FFFFFF',
    },
    eventList: {
      backgroundColor: theme.bgCard,
      borderRadius:    RADIUS.LG,
      overflow:        'hidden',
    },
    divider: {
      height:          1,
      backgroundColor: 'rgba(255,255,255,0.10)',
      marginHorizontal: SPACE.LG,
    },
    loadingText: {
      fontSize: FONT_SIZE.MD,
      color:    theme.textSecondary,
    },
    errorTitle: {
      fontSize:   FONT_SIZE.XL,
      fontWeight: FONT_WEIGHT.BOLD,
      color:      theme.textPrimary,
      textAlign:  'center',
    },
    errorBody: {
      fontSize:  FONT_SIZE.MD,
      color:     theme.textSecondary,
      textAlign: 'center',
    },
    retryBtn: {
      backgroundColor:   theme.bgCard,
      paddingHorizontal: SPACE.XL,
      paddingVertical:   SPACE.MD,
      borderRadius:      100,
      minWidth:          160,
      alignItems:        'center',
    },
    retryText: {
      fontSize:   FONT_SIZE.MD,
      fontWeight: FONT_WEIGHT.BOLD,
      color:      theme.textPrimary,
    },
  });
}
