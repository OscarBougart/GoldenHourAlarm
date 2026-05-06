import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { SPACE } from '@/constants/spacing';

export default function SettingsScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>App preferences and configuration</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
    paddingHorizontal: SPACE.LG,
    paddingTop: SPACE.XL,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZE.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACE.XS,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.MD,
  },
});
