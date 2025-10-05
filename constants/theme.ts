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
