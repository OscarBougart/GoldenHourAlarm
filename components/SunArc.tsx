import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '@/src/theme';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { SPACE } from '@/constants/spacing';
import { formatTime } from '@/utils/sunCalc';

export interface SunArcProps {
  sunrise: Date;
  sunset: Date;
  use24h: boolean;
}

export default function SunArc({ sunrise, sunset, use24h }: SunArcProps): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const arcWidth  = width - SPACE.LG * 2;
  const arcHeight = arcWidth * 0.52;
  const cx        = arcWidth / 2;
  const cy        = arcHeight;
  const rx        = arcWidth / 2 - 2;
  const ry        = arcHeight - 2;

  // Sun position: 0 = sunrise, 1 = sunset, clamped
  const progress = useMemo(() => {
    const now    = Date.now();
    const rise   = sunrise.getTime();
    const set    = sunset.getTime();
    if (now <= rise) return 0;
    if (now >= set)  return 1;
    return (now - rise) / (set - rise);
  }, [sunrise, sunset]);

  // Parametric ellipse: angle goes from π (left) to 0 (right)
  const angle  = Math.PI - progress * Math.PI;
  const sunX   = cx + rx * Math.cos(angle);
  const sunY   = cy - ry * Math.sin(angle);

  // Build arc path points for the background track and filled portion
  const STEPS  = 60;
  const points = Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = i / STEPS;
    const a = Math.PI - t * Math.PI;
    return { x: cx + rx * Math.cos(a), y: cy - ry * Math.sin(a) };
  });

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const filledCount = Math.round(progress * STEPS);
  const trackPath   = toPath(points);
  const filledPath  = filledCount > 0 ? toPath(points.slice(0, filledCount + 1)) : null;

  const isBelowHorizon = progress <= 0 || progress >= 1;

  return (
    <View style={[styles.container, { width: arcWidth, height: arcHeight + 32 }]}>
      {/* SVG-like arc drawn with absolute-positioned thin views — use canvas approach via Views */}
      <View style={[styles.arcCanvas, { width: arcWidth, height: arcHeight }]}>
        {/* Track segments */}
        {points.slice(0, -1).map((pt, i) => {
          const next   = points[i + 1];
          const dx     = next.x - pt.x;
          const dy     = next.y - pt.y;
          const len    = Math.sqrt(dx * dx + dy * dy);
          const angle_ = Math.atan2(dy, dx) * (180 / Math.PI);
          const filled = i < filledCount;
          return (
            <View
              key={i}
              style={{
                position:        'absolute',
                left:            pt.x,
                top:             pt.y - 1.5,
                width:           len + 0.5,
                height:          3,
                backgroundColor: filled
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.22)',
                borderRadius:    2,
                transform:       [{ rotate: `${angle_}deg` }],
                transformOrigin: '0 50%',
              }}
            />
          );
        })}

        {/* Sun dot */}
        {!isBelowHorizon && (
          <View
            style={[
              styles.sunDot,
              { left: sunX - 10, top: sunY - 10 },
            ]}
          />
        )}
      </View>

      {/* Sunrise / Sunset labels */}
      <View style={[styles.labelsRow, { width: arcWidth }]}>
        <View style={styles.labelBlock}>
          <Text style={styles.timeLabel}>{formatTime(sunrise, use24h)}</Text>
          <Text style={styles.eventLabel}>Sunrise</Text>
        </View>
        <View style={[styles.labelBlock, styles.labelRight]}>
          <Text style={styles.timeLabel}>{formatTime(sunset, use24h)}</Text>
          <Text style={styles.eventLabel}>Sunset</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  arcCanvas: {
    position: 'relative',
    overflow: 'hidden',
  },
  sunDot: {
    position:        'absolute',
    width:           20,
    height:          20,
    borderRadius:    10,
    backgroundColor: '#FFFFFF',
    shadowColor:     '#FFFFFF',
    shadowOpacity:   0.9,
    shadowRadius:    8,
    shadowOffset:    { width: 0, height: 0 },
    elevation:       6,
  },
  labelsRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingTop:     SPACE.SM,
  },
  labelBlock: {
    alignItems: 'flex-start',
  },
  labelRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize:   FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
    color:      '#FFFFFF',
  },
  eventLabel: {
    fontSize: FONT_SIZE.XS,
    color:    'rgba(255,255,255,0.55)',
  },
});
