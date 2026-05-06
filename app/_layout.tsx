import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout(): React.JSX.Element | null {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor={COLORS.BG_PRIMARY} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.BG_PRIMARY },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: { fontWeight: '500' },
          contentStyle: { backgroundColor: COLORS.BG_PRIMARY },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
});
