/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

type ColorPalette = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primaryButton: string;
  primaryButtonShadow: string;
  secondaryButton: string;
  secondaryButtonBorder: string;
  primaryGradient: [string, string];
  primaryGradientDisabled: [string, string];
  backgroundGradient: [string, string];
  surfaceGradient: [string, string];
  surfaceBorder: string;
  heroGlow: [string, string];
};

type Theme = {
  light: ColorPalette;
  dark: ColorPalette;
};

export const Colors: Theme = {
  light: {
    text: '#11181C',
    background: '#EFF3F4',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
    primaryButton: '#E4007C',
    primaryButtonShadow: 'rgba(228, 0, 124, 0.3)',
    secondaryButton: '#1C1924',
    secondaryButtonBorder: '#282531',
    primaryGradient: ['#FF3B91', '#8B1FA5'],
    primaryGradientDisabled: ['#5C415D', '#41334F'],
    backgroundGradient: ['#F8F2FF', '#EDE2FF'],
    surfaceGradient: ['#FFFFFF', '#F3E9FF'],
    surfaceBorder: 'rgba(140, 82, 255, 0.25)',
    heroGlow: ['rgba(135, 62, 255, 0.35)', 'rgba(255, 255, 255, 0.0)'],
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#7FFFD4',
    icon: '#ECEDEE',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#7FFFD4',
    primaryButton: '#E4007C',
    primaryButtonShadow: 'rgba(228, 0, 124, 0.45)',
    secondaryButton: '#282531',
    secondaryButtonBorder: '#3C3747',
    primaryGradient: ['#FF3B91', '#7217A6'],
    primaryGradientDisabled: ['#3E3447', '#2E2738'],
    backgroundGradient: ['#120724', '#070211'],
    surfaceGradient: ['rgba(40, 27, 56, 0.92)', 'rgba(22, 12, 32, 0.92)'],
    surfaceBorder: 'rgba(228, 0, 124, 0.22)',
    heroGlow: ['rgba(228, 0, 124, 0.35)', 'rgba(77, 36, 134, 0.05)'],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
