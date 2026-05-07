import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/theme';
import { SPACE } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { formatTime } from '@/utils/sunCalc';
import type { LightWindow, TimeRange } from '@/utils/types';

type EventRowVariant = 'golden' | 'blue' | 'sunrise' | 'sunset';

export interface EventRowProps {
  variant:       EventRowVariant;
  label:         string;
  timeRange:     TimeRange;
  use24h:        boolean;
  isActive:      boolean;
  alarmOn?:      boolean;
  lightWindow?:  LightWindow;
  onToggleAlarm?: (window: LightWindow) => void;
}

const ICON_CONFIG: Record<EventRowVariant, { name: React.ComponentProps<typeof Ionicons>['name']; color: string }> = {
  golden:  { name: 'sunny',            color: '#FFC947' },
  blue:    { name: 'moon',             color: '#7EB8F7' },
  sunrise: { name: 'partly-sunny',     color: '#FFB347' },
  sunset:  { name: 'cloudy-night',     color: '#C9A0DC' },
};

export default function EventRow({
  variant,
  label,
  timeRange,
  use24h,
  isActive,
  alarmOn,
  lightWindow,
  onToggleAlarm,
}: EventRowProps): React.JSX.Element {
  const theme = useTheme();
  const icon  = ICON_CONFIG[variant];

  const hasAlarm = lightWindow !== undefined && onToggleAlarm !== undefined;

  const handleToggle = () => {
    if (!hasAlarm) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleAlarm!(lightWindow!);
  };

  const timeStr = `${formatTime(timeRange.start, use24h)} – ${formatTime(timeRange.end, use24h)}`;

  return (
    <View
      style={[
        styles.row,
        isActive && { backgroundColor: 'rgba(255,255,255,0.12)' },
      ]}
      accessibilityLabel={`${label}: ${timeStr}`}
    >
      {/* Icon */}
      <View style={styles.iconWrap}>
        <Ionicons name={icon.name} size={28} color={icon.color} />
      </View>

      {/* Label + time */}
      <View style={styles.info}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {isActive && (
            <View style={styles.nowBadge}>
              <Text style={styles.nowText}>NOW</Text>
            </View>
          )}
        </View>
        <Text style={styles.timeStr}>{timeStr}</Text>
      </View>

      {/* Bell or spacer */}
      {hasAlarm ? (
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
            color={alarmOn ? '#FFFFFF' : 'rgba(255,255,255,0.35)'}
          />
        </Pressable>
      ) : (
        <View style={styles.bellBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: SPACE.MD,
    paddingHorizontal: SPACE.LG,
    borderRadius:   12,
    gap:            SPACE.MD,
  },
  iconWrap: {
    width:          40,
    height:         40,
    alignItems:     'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap:  2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACE.SM,
  },
  label: {
    fontSize:   FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color:      '#FFFFFF',
  },
  nowBadge: {
    backgroundColor:   'rgba(255,255,255,0.22)',
    borderRadius:      100,
    paddingHorizontal: SPACE.SM,
    paddingVertical:   2,
  },
  nowText: {
    fontSize:      FONT_SIZE.XS,
    fontWeight:    FONT_WEIGHT.BOLD,
    letterSpacing: 0.5,
    color:         '#FFFFFF',
  },
  timeStr: {
    fontSize: FONT_SIZE.SM,
    color:    'rgba(255,255,255,0.65)',
  },
  bellBtn: {
    width:          48,
    height:         48,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
});
