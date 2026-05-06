import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';
import { SPACE } from '@/constants/spacing';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = 'book-outline', title, subtitle }: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={COLORS.TEXT_MUTED} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE.SM,
    paddingHorizontal: SPACE.XL,
  },
  title: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.LG,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.TEXT_MUTED,
    fontSize: FONT_SIZE.SM,
    textAlign: 'center',
  },
});
