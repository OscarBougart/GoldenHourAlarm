import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';
import { RADIUS, SPACE } from '@/constants/spacing';
import { FONT_SIZE } from '@/constants/typography';

export interface FABProps {
  onPress: () => void;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
}

export default function FAB({ onPress, label, icon = 'add', accessibilityLabel }: FABProps): React.JSX.Element {
  const handlePress = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={24} color={COLORS.BG_PRIMARY} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: SPACE.XL,
    right: SPACE.LG,
    backgroundColor: COLORS.ACCENT,
    borderRadius: RADIUS.FAB,
    minWidth: 56,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.LG,
    gap: SPACE.SM,
    elevation: 4,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: COLORS.BG_PRIMARY,
    fontSize: FONT_SIZE.MD,
    fontWeight: '500',
  },
});
