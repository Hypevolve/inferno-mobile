import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Screen } from '@inferno/shared';

export default function AgeGateScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const { height } = useWindowDimensions();

  const handleEnter = () => {
    if (!isChecked) {
      return;
    }
    // TODO: Persist AgeGate completion and route to onboarding flow once implemented.
    console.log('Navigating from screen:', Screen.AGE_GATE);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { minHeight: height }]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Warning</Text>
          <Text style={styles.description}>
            This application contains explicit adult content (NSFW) and is intended for individuals 18 years of age or older. By entering, you confirm you are of legal age in your jurisdiction and consent to viewing sexually explicit material.
          </Text>

          <View style={styles.checkboxRow}>
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? '#E4007C' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>I am 18 or older and agree to the terms.</Text>
          </View>

          <Pressable
            onPress={handleEnter}
            disabled={!isChecked}
            style={({ pressed }) => [
              styles.button,
              pressed && isChecked && styles.buttonPressed,
              !isChecked && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Enter</Text>
          </Pressable>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E4007C',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#F0F0F0',
    marginBottom: 24,
    textAlign: 'center',
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
  },
  button: {
    backgroundColor: '#E4007C',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#6C6A71',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
