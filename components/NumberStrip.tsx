import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/theme';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { RADIUS } from '@/constants/spacing';

const ITEM_WIDTH = 48;
const ITEM_GAP   = 10;
const STEP       = ITEM_WIDTH + ITEM_GAP;

export interface NumberStripProps {
  min:      number;
  max:      number;
  value:    number;
  onChange: (value: number) => void;
}

export default function NumberStrip({
  min,
  max,
  value,
  onChange,
}: NumberStripProps): React.JSX.Element {
  const theme          = useRef(useTheme()).current;
  const scrollRef      = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const prevValue      = useRef(value);
  const isExternalSync = useRef(false);

  const sidePad = containerWidth > 0 ? (containerWidth - ITEM_WIDTH) / 2 : 0;

  const xFor = useCallback(
    (val: number) => (val - min) * STEP,
    [min],
  );

  const scrollToValue = useCallback(
    (val: number, animated: boolean) => {
      scrollRef.current?.scrollTo({ x: xFor(val), animated });
    },
    [xFor],
  );

  const didInit = useRef(false);
  useEffect(() => {
    if (containerWidth > 0 && !didInit.current) {
      didInit.current = true;
      scrollRef.current?.scrollTo({ x: xFor(value), animated: false });
    }
  }, [containerWidth, xFor, value]);

  useEffect(() => {
    if (prevValue.current !== value && containerWidth > 0) {
      prevValue.current      = value;
      isExternalSync.current = true;
      scrollToValue(value, true);
    }
  }, [value, containerWidth, scrollToValue]);

  const handleMomentumEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      if (isExternalSync.current) {
        isExternalSync.current = false;
        return;
      }
      const x    = e.nativeEvent.contentOffset.x;
      const idx  = Math.round(x / STEP);
      const next = Math.min(max, Math.max(min, min + idx));

      scrollRef.current?.scrollTo({ x: xFor(next), animated: true });

      if (next !== prevValue.current) {
        prevValue.current = next;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onChange(next);
      }
    },
    [min, max, xFor, onChange],
  );

  return (
    <View
      style={styles.wrapper}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      accessibilityLabel={`Select minutes: ${value}`}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={STEP}
        snapToAlignment="start"
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.strip,
          { paddingHorizontal: sidePad },
        ]}
      >
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => {
          const isSelected = n === value;
          return (
            <View key={n} style={styles.item}>
              <Text
                style={[
                  styles.number,
                  {
                    color:      theme.textPrimary,
                    fontWeight: isSelected ? FONT_WEIGHT.BLACK  : FONT_WEIGHT.NORMAL,
                    fontSize:   isSelected ? FONT_SIZE.LG       : FONT_SIZE.MD,
                    opacity:    isSelected ? 1 : 0.45,
                  },
                ]}
              >
                {n}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {containerWidth > 0 && (
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              left:            (containerWidth - ITEM_WIDTH) / 2,
              backgroundColor: 'transparent',
              borderColor:     theme.border,
            },
          ]}
        />
      )}

      <View
        pointerEvents="none"
        style={[styles.fade, styles.fadeLeft, { backgroundColor: theme.bgCard }]}
      />
      <View
        pointerEvents="none"
        style={[styles.fade, styles.fadeRight, { backgroundColor: theme.bgCard }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height:   56,
    overflow: 'hidden',
  },
  strip: {
    alignItems: 'center',
    gap:        ITEM_GAP,
  },
  item: {
    width:          ITEM_WIDTH,
    height:         56,
    alignItems:     'center',
    justifyContent: 'center',
  },
  number: {
    textAlign: 'center',
  },
  highlight: {
    position:     'absolute',
    top:          8,
    bottom:       8,
    width:        ITEM_WIDTH,
    borderRadius: RADIUS.MD,
    borderWidth:  1,
  },
  fade: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    width:    52,
  },
  fadeLeft:  { left: 0 },
  fadeRight: { right: 0 },
});
