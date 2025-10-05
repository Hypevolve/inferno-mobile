import { Platform } from 'react-native';

export const Fonts = {
  poppinsRegular: 'Poppins_400Regular',
  poppinsSemiBold: 'Poppins_600SemiBold',
  poppinsBold: 'Poppins_700Bold',
  poppinsExtraBold: 'Poppins_800ExtraBold',
  script: Platform.select({
    ios: 'Brush Script MT',
    macos: 'Brush Script MT',
    default: 'DancingScript_700Bold',
  }) as string,
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    default: 'monospace',
  }) as string,
};
