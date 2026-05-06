import { TextInput, View, Text, StyleSheet, type TextInputProps } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE } from '@/constants/typography';
import { SPACE, RADIUS } from '@/constants/spacing';

export interface InputProps extends TextInputProps {
  label?: string;
}

export default function Input({ label, style, ...props }: InputProps): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={COLORS.TEXT_MUTED}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: SPACE.XS,
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.SM,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: RADIUS.MD,
    paddingHorizontal: SPACE.LG,
    paddingVertical: SPACE.MD,
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZE.MD,
    minHeight: 48,
  },
});
