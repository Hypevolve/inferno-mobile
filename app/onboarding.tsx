import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@inferno/shared';

import { useAppState } from '@/providers/AppStateProvider';
import { InfernoButton } from '@/components/ui/inferno-button';
import { Fonts } from '@/constants/typography';
import { ProfileCreator } from '@/components/onboarding/ProfileCreator';
import { Colors } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { currentScreen, setCurrentScreen, userProfile } = useAppState();
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (
      currentScreen !== Screen.ONBOARDING_WELCOME &&
      currentScreen !== Screen.PROFILE_CREATOR &&
      currentScreen !== Screen.AGE_GATE
    ) {
      router.replace('/(tabs)');
    }
  }, [currentScreen, router]);

  if (currentScreen === Screen.PROFILE_CREATOR) {
    return <ProfileCreator existingProfile={userProfile} />;
  }

  const theme = Colors.dark;

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.gradient}>
      <SafeAreaView style={[styles.safeArea, { minHeight: height }]}> 
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Ionicons name="flame" size={36} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.title}>Slide into the heat</Text>
              <Text style={styles.subtitle}>
                Inferno connects confident adults ready to flirt harder and find playmates who match their vibe.
              </Text>

              <InfernoButton
                title="Create my profile"
                onPress={() => setCurrentScreen(Screen.PROFILE_CREATOR)}
                style={styles.cta}
              />
              <Text style={styles.helperText}>Already have one? Head to matches from the tabs.</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 10, 24, 0.88)',
  },
  cardContent: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 20,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.poppinsExtraBold,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: '#E1D8FF',
    fontFamily: Fonts.poppinsRegular,
    textAlign: 'center',
  },
  cta: {
    width: '100%',
  },
  helperText: {
    fontSize: 12,
    color: '#B3A4D4',
    textAlign: 'center',
    fontFamily: Fonts.poppinsRegular,
  },
  placeholderContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#110F17',
  },
  placeholderTitle: {
    fontSize: 28,
    fontFamily: Fonts.poppinsBold,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholderDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CFCBD9',
    textAlign: 'center',
    fontFamily: Fonts.poppinsRegular,
    marginBottom: 32,
  },
  placeholderButton: {
    paddingHorizontal: 32,
  },
  placeholderButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.poppinsSemiBold,
  },
});
