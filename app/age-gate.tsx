import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAppState } from '@/providers/AppStateProvider';
import { InfernoButton } from '@/components/ui/inferno-button';
import { Fonts } from '@/constants/typography';
import { Colors } from '@/constants/theme';

export default function AgeGateScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { isAgeVerified, setAgeVerified } = useAppState();

  useEffect(() => {
    if (isAgeVerified) {
      router.replace('/onboarding');
    }
  }, [isAgeVerified, router]);

  const handleEnter = () => {
    if (!isChecked) {
      return;
    }
    setAgeVerified();
    router.replace('/onboarding');
  };

  const theme = Colors.dark;

  return (
    <LinearGradient colors={theme.backgroundGradient} style={styles.gradient}>
      <SafeAreaView style={[styles.safeArea, { minHeight: height }]}> 
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.heroIconWrapper}>
                <Ionicons name="flame" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Ready to play with fire?</Text>
              <Text style={styles.subtitle}>
                Confirm you’re 18+ to keep Inferno a consent-first space for grown-ups only.
              </Text>

              <View style={styles.checkboxRow}>
                <Checkbox
                  value={isChecked}
                  onValueChange={setIsChecked}
                  color={isChecked ? theme.primaryButton : '#3C3550'}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>I confirm I&apos;m 18+ and down for an adult-only experience.</Text>
              </View>

              <InfernoButton
                title="Enter Inferno"
                disabled={!isChecked}
                onPress={handleEnter}
                style={styles.button}
              />
              <Text style={styles.helperText}>We keep it respectful. You stay in control.</Text>
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
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
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
  },
  heroIconWrapper: {
    alignItems: 'center',
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
  infoList: {
    gap: 16,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 59, 145, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: '#D9D0FF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.poppinsRegular,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#EDE3FF',
    fontFamily: Fonts.poppinsRegular,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  helperText: {
    fontSize: 12,
    color: '#B3A4D4',
    textAlign: 'center',
    fontFamily: Fonts.poppinsRegular,
  },
});
