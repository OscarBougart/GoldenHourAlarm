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
import { SPACE } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import TimeCard from '@/components/TimeCard';
import CountdownBanner from '@/components/CountdownBanner';
import CitySearchModal from '@/components/CitySearchModal';
import type { LightWindow } from '@/utils/types';
import { LIGHT_WINDOW_LABELS } from '@/utils/types';
import type { CityResult } from '@/hooks/useCitySearch';

const TODAY = new Date();

const WINDOW_ORDER: LightWindow[] = [
  'morningBlue',
  'morningGolden',
  'eveningGolden',
  'eveningBlue',
];

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

  useScheduleAlarms(sunTimes, alarmPrefs, settings.notificationOffsetMinutes);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const dateLabel = useMemo(() => {
    return TODAY.toLocaleDateString(undefined, {
      weekday: 'long',
      month:   'long',
      day:     'numeric',
    });
  }, []);

  const countdownIsGolden =
    countdown.key === 'morningGolden' || countdown.key === 'eveningGolden';

  const handleCitySelect = async (city: CityResult) => {
    await setManualCity(city);
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

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
        {/* Header */}
        <View style={styles.header}>
          {/* Date + city pill */}
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

          {/* Settings icon top-right */}
          <Pressable
            style={styles.settingsBtn}
            onPress={handleSettingsPress}
            accessibilityLabel="Open settings"
            accessibilityRole="button"
          >
            <Ionicons name="settings-outline" size={22} color={theme.textPrimary} />
          </Pressable>
        </View>

        {/* Countdown banner */}
        {sunTimes && (
          <CountdownBanner
            targetKey={countdown.key}
            msLeft={countdown.msLeft}
            isActive={countdown.isActive}
            isGolden={countdownIsGolden}
          />
        )}

        {/* Time cards */}
        {sunTimes ? (
          <View style={styles.cards}>
            {WINDOW_ORDER.map((key) => {
              const isGolden = key === 'morningGolden' || key === 'eveningGolden';
              const isActive = countdown.isActive && countdown.key === key;
              return (
                <TimeCard
                  key={key}
                  window={key}
                  label={LIGHT_WINDOW_LABELS[key]}
                  timeRange={sunTimes[key]}
                  isGolden={isGolden}
                  alarmOn={alarmPrefs[key]}
                  use24h={settings.timeFormat === '24h'}
                  isActive={isActive}
                  onToggleAlarm={(w) => setAlarmPref(w, !alarmPrefs[w])}
                />
              );
            })}
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
      gap:               SPACE.MD,
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
      flex:    1,
      gap:     4,
      flexShrink: 1,
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
    cards: {
      gap: isSmall ? SPACE.SM : SPACE.MD,
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
