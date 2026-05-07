import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '@/src/theme';
import { SPACE, RADIUS } from '@/constants/spacing';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { LIGHT_WINDOW_LABELS } from '@/utils/types';
import { formatCountdown } from '@/utils/sunCalc';
import type { LightWindow } from '@/utils/types';

export interface CountdownBannerProps {
  targetKey: LightWindow | null;
  msLeft:    number;
  isActive:  boolean;
  isGolden:  boolean;
}

export default function CountdownBanner({
  targetKey,
  msLeft,
  isActive,
}: CountdownBannerProps): React.JSX.Element {
  const theme  = useTheme();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;

  if (!targetKey) {
    return (
      <View style={[styles.banner, { backgroundColor: theme.bgCard }]}>
        <Text style={styles.noMore}>No more light windows today</Text>
      </View>
    );
  }

  const label  = LIGHT_WINDOW_LABELS[targetKey];
  const prefix = isActive ? 'Ends in' : 'Starts in';

  return (
    <View
      style={[styles.banner, { backgroundColor: theme.bgCard, padding: isSmall ? SPACE.MD : SPACE.LG }]}
      accessibilityLabel={`${prefix} ${formatCountdown(msLeft)}`}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.prefixText}>
            {isActive ? 'HAPPENING NOW' : 'NEXT WINDOW'}
          </Text>
          <Text style={[styles.windowName, { fontSize: isSmall ? FONT_SIZE.MD : FONT_SIZE.LG }]}>
            {label}
          </Text>
        </View>
        <View style={styles.countdownBox}>
          <Text style={[styles.countdownText, { fontSize: isSmall ? 22 : FONT_SIZE['2XL'] }]}>
            {formatCountdown(msLeft)}
          </Text>
          <Text style={styles.prefixText}>{prefix}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: RADIUS.LG,
    padding:      SPACE.LG,
  },
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  left: {
    flex:           1,
    paddingRight:   SPACE.MD,
  },
  prefixText: {
    fontSize:      FONT_SIZE.XS,
    fontWeight:    FONT_WEIGHT.MEDIUM,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color:         'rgba(255,255,255,0.60)',
  },
  windowName: {
    fontWeight: FONT_WEIGHT.BOLD,
    marginTop:  SPACE.XS,
    color:      '#FFFFFF',
  },
  countdownBox: {
    alignItems: 'flex-end',
    gap:        SPACE.XS,
  },
  countdownText: {
    fontWeight:  FONT_WEIGHT.BLACK,
    fontVariant: ['tabular-nums'],
    color:       '#FFFFFF',
  },
  noMore: {
    fontSize:  FONT_SIZE.MD,
    color:     'rgba(255,255,255,0.60)',
    textAlign: 'center' as const,
  },
});
