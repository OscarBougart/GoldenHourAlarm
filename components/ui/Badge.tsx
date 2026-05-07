import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';
import { SPACE, RADIUS } from '@/constants/spacing';

export type BadgeVariant = 'amber' | 'red' | 'green' | 'default';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  amber:   { bg: COLORS.ACCENT_DIM, text: COLORS.ACCENT },
  red:     { bg: 'rgba(255,107,107,0.20)', text: COLORS.RED },
  green:   { bg: 'rgba(46,204,113,0.20)',  text: COLORS.GREEN },
  default: { bg: COLORS.BG_ELEVATED, text: COLORS.TEXT_SECONDARY },
};

export default function Badge({ label, variant = 'default' }: BadgeProps): React.JSX.Element {
  const { bg, text } = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.SM,
    paddingHorizontal: SPACE.SM,
    paddingVertical: SPACE.XS,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FONT_SIZE.XS,
    fontWeight: '500',
  },
});
