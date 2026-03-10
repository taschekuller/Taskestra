import { type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';

export const GradientBackground = ({ children }: PropsWithChildren) => {
  const scheme = useColorScheme();
  const gradientColors = (scheme === 'light'
    ? Colors.backgroundGradientLight
    : Colors.backgroundGradient) as [string, string, string];

  return (
    <LinearGradient
      colors={gradientColors}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};
