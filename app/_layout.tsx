import { useEffect } from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppStateProvider } from '@/providers/AppStateProvider';

export const unstable_settings = {
  anchor: 'age-gate',
};

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore if already prevented
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    DancingScript_700Bold,
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppStateProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="age-gate">
          <Stack.Screen name="age-gate" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppStateProvider>
  );
}
