import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
import { SPACE } from '@/constants/spacing';

export default function HomeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello App</Text>
      <Text style={styles.subtitle}>Your new project starts here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.LG,
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
