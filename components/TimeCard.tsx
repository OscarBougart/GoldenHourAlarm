import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/theme';
import { SPACE, RADIUS } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { formatTime } from '@/utils/sunCalc';
import type { LightWindow, TimeRange } from '@/utils/types';

export interface TimeCardProps {
  window:        LightWindow;
  label:         string;
  timeRange:     TimeRange;
  isGolden:      boolean;
  alarmOn:       boolean;
  use24h:        boolean;
  isActive:      boolean;
  onToggleAlarm: (window: LightWindow) => void;
}

export default function TimeCard({
  window: win,
  label,
  timeRange,
  alarmOn,
  use24h,
  isActive,
  onToggleAlarm,
}: TimeCardProps): React.JSX.Element {
  const theme  = useTheme();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleAlarm(win);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isActive
            ? 'rgba(255,255,255,0.22)'
            : theme.bgCard,
          borderColor: isActive ? theme.border : 'transparent',
          padding: isSmall ? SPACE.MD : SPACE.LG,
        },
      ]}
      accessibilityLabel={`${label} time card`}
    >
      {/* Label row */}
      <View style={styles.header}>
        <View style={styles.labelRow}>
          {isActive && <View style={styles.activeDot} />}
          <Text style={[styles.label, { fontSize: isSmall ? FONT_SIZE.SM : FONT_SIZE.MD }]}>
            {label}
          </Text>
          {isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>NOW</Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={handleToggle}
          style={styles.bellBtn}
          accessibilityLabel={alarmOn ? `Disable alarm for ${label}` : `Enable alarm for ${label}`}
          accessibilityRole="switch"
          accessibilityState={{ checked: alarmOn }}
          hitSlop={8}
        >
          <Ionicons
            name={alarmOn ? 'notifications' : 'notifications-outline'}
            size={22}
            color={alarmOn ? theme.textPrimary : theme.textMuted}
          />
        </Pressable>
      </View>

      {/* Times */}
      <View style={styles.times}>
        <View style={styles.timeBlock}>
          <Text style={[styles.timeLabel, { fontSize: isSmall ? 9 : FONT_SIZE.XS }]}>START</Text>
          <Text style={[styles.timeValue, { fontSize: isSmall ? FONT_SIZE.LG : FONT_SIZE.XL }]}>
            {formatTime(timeRange.start, use24h)}
          </Text>
        </View>
        <View style={[styles.timeSeparator, { backgroundColor: theme.border }]} />
        <View style={styles.timeBlock}>
          <Text style={[styles.timeLabel, { fontSize: isSmall ? 9 : FONT_SIZE.XS }]}>END</Text>
          <Text style={[styles.timeValue, { fontSize: isSmall ? FONT_SIZE.LG : FONT_SIZE.XL }]}>
            {formatTime(timeRange.end, use24h)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.LG,
    borderWidth:  1,
    gap:          SPACE.MD,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACE.SM,
    flex:          1,
  },
  activeDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontWeight: FONT_WEIGHT.MEDIUM,
    color:      '#FFFFFF',
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius:    100,
    paddingHorizontal: SPACE.SM,
    paddingVertical:   2,
  },
  activeBadgeText: {
    fontSize:      FONT_SIZE.XS,
    fontWeight:    FONT_WEIGHT.BOLD,
    letterSpacing: 0.5,
    color:         '#FFFFFF',
  },
  bellBtn: {
    width:          48,
    height:         48,
    alignItems:     'center',
    justifyContent: 'center',
  },
  times: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  timeBlock: {
    flex: 1,
    gap:  SPACE.XS,
  },
  timeLabel: {
    fontWeight:    FONT_WEIGHT.MEDIUM,
    color:         'rgba(255,255,255,0.55)',
    letterSpacing: 1,
  },
  timeValue: {
    fontWeight: FONT_WEIGHT.BOLD,
    color:      '#FFFFFF',
  },
  timeSeparator: {
    width:            1,
    height:           40,
    marginHorizontal: SPACE.LG,
  },
});
