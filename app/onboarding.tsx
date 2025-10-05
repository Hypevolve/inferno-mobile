import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@inferno/shared';

import { useAppState } from '@/providers/AppStateProvider';
import { InfernoButton } from '@/components/ui/inferno-button';
import { Fonts } from '@/constants/typography';
import { ProfileCreator } from '@/components/onboarding/ProfileCreator';

export default function OnboardingScreen() {
  const router = useRouter();
  const { currentScreen, setCurrentScreen, userProfile } = useAppState();

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="flame" size={96} color="#E4007C" />
        </View>
        <Text style={styles.title}>Slide into the heat</Text>
        <Text style={styles.subtitle}>
          We match confident, curious adults looking to flirt harder, play smarter, and explore without judgement.
        </Text>
        <InfernoButton
          title="Create My Profile"
          onPress={() => setCurrentScreen(Screen.PROFILE_CREATOR)}
          style={styles.primaryButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#110F17',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1924',
    borderWidth: 1,
    borderColor: '#282531',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.poppinsExtraBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#CFCBD9',
    textAlign: 'center',
    fontFamily: Fonts.poppinsRegular,
  },
  primaryButton: {
    marginTop: 40,
    width: '100%',
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
