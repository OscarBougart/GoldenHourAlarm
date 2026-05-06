import { View, StyleSheet, type ViewProps } from 'react-native';
import { COLORS } from '@/constants/colors';
import { RADIUS } from '@/constants/spacing';

export interface CardProps extends ViewProps {
  elevated?: boolean;
}

export default function Card({ elevated = false, style, children, ...props }: CardProps): React.JSX.Element {
  return (
    <View
      style={[styles.card, elevated && styles.elevated, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  elevated: {
    backgroundColor: COLORS.BG_ELEVATED,
  },
});
