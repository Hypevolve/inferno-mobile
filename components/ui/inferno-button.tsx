import React from 'react';
import {
  Pressable,
  type PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/theme';
import { Fonts } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';

type InfernoButtonVariant = 'primary' | 'secondary';

type InfernoButtonProps = PressableProps & {
  title: string;
  variant?: InfernoButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function InfernoButton({
  title,
  variant = 'primary',
  disabled,
  style,
  textStyle,
  ...rest
}: InfernoButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Pressable disabled={disabled} {...rest}>
      {({ pressed }) => {
        if (variant === 'primary') {
          const gradientColors = disabled ? theme.primaryGradientDisabled : theme.primaryGradient;
          return (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                styles.primary,
                pressed && !disabled && styles.primaryPressed,
                disabled && styles.primaryDisabled,
                style as StyleProp<ViewStyle>,
              ]}
            >
              <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
          );
        }

        const secondaryBackground = disabled
          ? 'rgba(255,255,255,0.04)'
          : pressed
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.08)';

        return (
          <View
            style={[
              styles.secondary,
              { backgroundColor: secondaryBackground, borderColor: theme.secondaryButtonBorder },
              disabled && styles.secondaryDisabled,
              style as StyleProp<ViewStyle>,
            ]}
          >
            <Text
              style={[
                styles.secondaryText,
                { color: disabled ? 'rgba(255,255,255,0.55)' : '#FFFFFF' },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: {
    transform: [{ scale: 0.98 }],
  },
  primaryDisabled: {
    opacity: 0.65,
  },
  secondary: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryDisabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 16,
    letterSpacing: 0.2,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryText: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
