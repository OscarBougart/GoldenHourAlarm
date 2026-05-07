import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Text, ImageBackground, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '@/constants/colors';
import { FONT_WEIGHT } from '@/constants/typography';

SplashScreen.preventAutoHideAsync();

const BG = require('@/assets/images/splash.jpg');

export default function RootLayout(): React.JSX.Element | null {
  const { height } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(1)).current;

  // Called once our ImageBackground has painted — then we drop the native splash
  const onImageLoaded = useCallback(() => {
    SplashScreen.hideAsync();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue:         0,
        duration:        500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, [opacity]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor={COLORS.BG_PRIMARY} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
      </Stack>

      {/* Custom splash overlay — fades out once app is ready */}
      <Animated.View style={[styles.splash, { opacity }]} pointerEvents="none">
        <ImageBackground source={BG} style={styles.bg} resizeMode="cover" onLoadEnd={onImageLoaded}>
          {/* Dark scrim so text is readable */}
          <View style={styles.scrim} />
          {/* Title at ~30% from the top */}
          <Text style={[styles.title, { top: height * 0.30 }]}>
            Golden Hour
          </Text>
        </ImageBackground>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  bg: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  title: {
    position:   'absolute',
    alignSelf:  'center',
    fontSize:   42,
    fontWeight: FONT_WEIGHT.BLACK,
    color:      '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor:  'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});
