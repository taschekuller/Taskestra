import { BlurView } from 'expo-blur';
import { type PropsWithChildren } from 'react';
import { Platform, StyleSheet, type StyleProp, type ViewStyle, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface GlassCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  intensity?: number;
}

export const GlassCard = ({ children, style, contentStyle, intensity = 60 }: GlassCardProps) => {
  const scheme = useColorScheme();
  const isLight = scheme === 'light';

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint={isLight ? 'light' : 'dark'} style={[styles.base, style]}>
        <View style={[styles.inner, contentStyle]}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.base, isLight ? styles.androidLightFallback : styles.androidDarkFallback, style]}>
      <View style={[styles.inner, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Layout.radius.card,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    overflow: 'hidden',
    ...Layout.shadow.ios,
    ...Layout.shadow.android,
  },
  inner: {
    backgroundColor: Colors.surface.level1,
    padding: Layout.spacing.md,
  },
  androidLightFallback: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(15,23,42,0.15)',
  },
  androidDarkFallback: {
    backgroundColor: Colors.surface.level2,
    borderColor: Colors.border.soft,
  },
});
