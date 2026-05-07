import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import NumberStrip from '@/components/NumberStrip';
import CitySearchModal from '@/components/CitySearchModal';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { useLocation } from '@/hooks/useLocation';
import { useTheme } from '@/src/theme';
import { SPACE, RADIUS } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import type { TimeFormat } from '@/utils/types';
import type { CityResult } from '@/hooks/useCitySearch';

const OFFSET_OPTIONS = [5, 10, 15, 20, 30];

export default function SettingsScreen(): React.JSX.Element {
  const theme    = useTheme();
  const router   = useRouter();
  const { width } = useWindowDimensions();
  const isSmall  = width < 375;
  const styles   = makeStyles(theme, isSmall);

  const settings    = useAlarmStore((s) => s.settings);
  const setSettings = useAlarmStore((s) => s.setSettings);
  const location    = useAlarmStore((s) => s.location);
  const { requestLocation, loading: locLoading, setManualCity } = useLocation();

  const [cityModalVisible, setCityModalVisible] = useState(false);

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleTimeFormat = (f: TimeFormat) => {
    haptic();
    setSettings({ timeFormat: f });
  };

  const handleOffsetChip = (min: number) => {
    haptic();
    setSettings({ notificationOffsetMinutes: min });
  };

  const handleOffsetStrip = (min: number) => {
    setSettings({ notificationOffsetMinutes: min });
  };

  const handleDetectLocation = async () => {
    haptic();
    await requestLocation();
  };

  const handleCitySelect = async (city: CityResult) => {
    await setManualCity(city);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Page header with back chevron */}
      <View style={styles.pageHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={26} color={theme.textPrimary} />
        </Pressable>
        <Text style={styles.pageTitle}>Settings</Text>
        {/* Spacer to centre title */}
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Location */}
        <Section title="Location" theme={theme}>
          {location && (
            <View style={styles.currentLocation}>
              <Ionicons name="location-sharp" size={14} color={theme.textPrimary} />
              <Text style={styles.currentLocationText} numberOfLines={1}>
                {location.cityName}
              </Text>
              <Text style={styles.coordsText} numberOfLines={1}>
                {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
              </Text>
            </View>
          )}

          <Pressable
            style={styles.actionBtn}
            onPress={handleDetectLocation}
            accessibilityLabel="Auto-detect location"
            accessibilityRole="button"
            disabled={locLoading}
          >
            <Ionicons
              name={locLoading ? 'sync-outline' : 'navigate-outline'}
              size={18}
              color={theme.textPrimary}
            />
            <Text style={styles.actionBtnText}>
              {locLoading ? 'Detecting…' : 'Use GPS Location'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => setCityModalVisible(true)}
            accessibilityLabel="Search for a city manually"
            accessibilityRole="button"
          >
            <Ionicons name="search-outline" size={18} color={theme.textPrimary} />
            <Text style={styles.actionBtnText}>Search City Manually</Text>
          </Pressable>
        </Section>

        {/* Notification offset */}
        <Section title="Alert Me Before" theme={theme}>
          <Text style={styles.sectionSubtitle}>
            Minutes before golden/blue hour starts
          </Text>
          <View style={styles.chipRow}>
            {OFFSET_OPTIONS.map((min) => {
              const active = settings.notificationOffsetMinutes === min;
              return (
                <Pressable
                  key={min}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => handleOffsetChip(min)}
                  accessibilityLabel={`${min} minutes before`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {min} min
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <NumberStrip
            min={1}
            max={120}
            value={settings.notificationOffsetMinutes}
            onChange={handleOffsetStrip}
          />
        </Section>

        {/* Time format */}
        <Section title="Time Format" theme={theme}>
          <View style={styles.segmentRow}>
            {(['12h', '24h'] as TimeFormat[]).map((f) => {
              const active = settings.timeFormat === f;
              return (
                <Pressable
                  key={f}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => handleTimeFormat(f)}
                  accessibilityLabel={`${f} time format`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {f}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      </ScrollView>

      <CitySearchModal
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        onSelect={handleCitySelect}
      />
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: ReturnType<typeof useTheme>;
}): React.JSX.Element {
  const styles = makeSectionStyles(theme);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>, isSmall: boolean) {
  const pad = isSmall ? SPACE.MD : SPACE.LG;
  return StyleSheet.create({
    root: {
      flex:            1,
      backgroundColor: theme.bgPrimary,
    },
    pageHeader: {
      flexDirection:     'row',
      alignItems:        'center',
      justifyContent:    'space-between',
      paddingHorizontal: SPACE.SM,
      paddingTop:        SPACE.SM,
      paddingBottom:     SPACE.SM,
    },
    backBtn: {
      width:          44,
      height:         44,
      alignItems:     'center',
      justifyContent: 'center',
    },
    pageTitle: {
      fontSize:   FONT_SIZE.LG,
      fontWeight: FONT_WEIGHT.BOLD,
      color:      theme.textPrimary,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding:       pad,
      gap:           SPACE.XL,
      paddingBottom: SPACE['2XL'] * 2,
    },
    currentLocation: {
      flexDirection: 'row',
      alignItems:    'center',
      gap:           SPACE.XS,
      flexWrap:      'wrap',
    },
    currentLocationText: {
      fontSize:   FONT_SIZE.MD,
      fontWeight: FONT_WEIGHT.MEDIUM,
      color:      theme.textPrimary,
      flexShrink: 1,
    },
    coordsText: {
      fontSize:   FONT_SIZE.XS,
      color:      theme.textMuted,
      flexShrink: 1,
    },
    actionBtn: {
      flexDirection:   'row',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             SPACE.SM,
      borderRadius:    RADIUS.MD,
      paddingVertical: SPACE.MD,
      minHeight:       48,
      backgroundColor: theme.bgElevated,
    },
    actionBtnText: {
      fontSize:   FONT_SIZE.MD,
      fontWeight: FONT_WEIGHT.MEDIUM,
      color:      theme.textPrimary,
    },
    sectionSubtitle: {
      fontSize: FONT_SIZE.SM,
      color:    theme.textSecondary,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap:      'wrap',
      gap:           SPACE.SM,
    },
    chip: {
      borderWidth:       1,
      borderRadius:      100,
      paddingHorizontal: SPACE.LG,
      paddingVertical:   SPACE.SM,
      minHeight:         40,
      alignItems:        'center',
      justifyContent:    'center',
      borderColor:       theme.border,
      backgroundColor:   theme.bgCard,
    },
    chipActive: {
      backgroundColor: 'rgba(255,255,255,0.30)',
      borderColor:     theme.textPrimary,
    },
    chipText: {
      fontSize:   FONT_SIZE.SM,
      fontWeight: FONT_WEIGHT.MEDIUM,
      color:      theme.textSecondary,
    },
    chipTextActive: {
      color: theme.textPrimary,
    },
    segmentRow: {
      flexDirection: 'row',
      gap:           SPACE.SM,
    },
    segment: {
      flex:            1,
      alignItems:      'center',
      justifyContent:  'center',
      borderWidth:     1,
      borderRadius:    RADIUS.MD,
      paddingVertical: SPACE.MD,
      minHeight:       48,
      borderColor:     theme.border,
      backgroundColor: theme.bgCard,
    },
    segmentActive: {
      backgroundColor: 'rgba(255,255,255,0.30)',
      borderColor:     theme.textPrimary,
    },
    segmentText: {
      fontSize:   FONT_SIZE.SM,
      fontWeight: FONT_WEIGHT.MEDIUM,
      color:      theme.textSecondary,
    },
    segmentTextActive: {
      color: theme.textPrimary,
    },
  });
}

function makeSectionStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    section: {
      gap: SPACE.SM,
    },
    sectionTitle: {
      fontSize:      FONT_SIZE.XS,
      fontWeight:    FONT_WEIGHT.BOLD,
      color:         theme.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase' as const,
    },
    sectionBody: {
      backgroundColor: theme.bgCard,
      borderRadius:    RADIUS.MD,
      padding:         SPACE.LG,
      gap:             SPACE.MD,
    },
  });
}
