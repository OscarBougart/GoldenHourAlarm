import React from 'react';
import { Text, StyleSheet } from 'react-native';
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
  if (!targetKey) {
    return <Text style={styles.text}>No more light windows today</Text>;
  }

  const label  = LIGHT_WINDOW_LABELS[targetKey];
  const prefix = isActive ? 'ends in' : 'in';

  return (
    <Text style={styles.text} accessibilityLabel={`${label} ${prefix} ${formatCountdown(msLeft)}`}>
      <Text style={styles.name}>{label}</Text>
      {' '}
      <Text style={styles.muted}>{prefix}</Text>
      {' '}
      <Text style={styles.countdown}>{formatCountdown(msLeft)}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize:  FONT_SIZE.SM,
    textAlign: 'center' as const,
    color:     'rgba(255,255,255,0.65)',
  },
  name: {
    fontWeight: FONT_WEIGHT.MEDIUM,
    color:      '#FFFFFF',
  },
  muted: {
    color: 'rgba(255,255,255,0.55)',
  },
  countdown: {
    fontWeight:  FONT_WEIGHT.BOLD,
    color:       '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
});
