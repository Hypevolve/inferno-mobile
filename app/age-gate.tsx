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

  return (
    <LinearGradient colors={['#1A1625', '#110F17']} style={styles.gradient}>
      <SafeAreaView style={[styles.safeArea, { minHeight: height }]}> 
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.headerStack}>
              <View style={styles.iconCircle}>
                <Ionicons name="flame" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Ready to play with fire?</Text>
              <Text style={styles.subtitle}>Inferno is an after-dark playground for bold, consenting adults. Confirm your age and step past the velvet rope.</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Ionicons name="lock-closed" size={18} color="#CFCBD9" />
                <Text style={styles.infoText}>Keep it discreet with private modes and vaulted media.</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="sparkles" size={18} color="#CFCBD9" />
                <Text style={styles.infoText}>Match with thrill-seekers who crave the same heat you do.</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="alert-circle" size={18} color="#CFCBD9" />
                <Text style={styles.infoText}>Strictly 18+. Your consent keeps the experience electric.</Text>
              </View>
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? '#E4007C' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>I confirm I am 18+ and consent to view adult content.</Text>
            </View>

            <InfernoButton
              title="Continue"
              disabled={!isChecked}
              onPress={handleEnter}
              style={styles.button}
            />
            <Text style={styles.helperText}>Treat everyone with respect and keep consent front and center.</Text>
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
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1C1924',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#282531',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },
  headerStack: {
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4007C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E4007C',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.poppinsExtraBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#CFCBD9',
    fontFamily: Fonts.poppinsRegular,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#2E2837',
    marginVertical: 20,
  },
  infoList: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: '#CFCBD9',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.poppinsRegular,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#F0F0F0',
    fontFamily: Fonts.poppinsRegular,
  },
  button: {
    width: '100%',
  },
  helperText: {
    fontSize: 12,
    color: '#716C7F',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: Fonts.poppinsRegular,
  },
});
