import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface LiquidFabProps {
  onPress: () => void;
  icon: ReactNode;
  size?: number;
  tone?: 'default' | 'accent';
}

export const LiquidFab = ({ onPress, icon, size = 56, tone = 'default' }: LiquidFabProps) => {
  const scheme = useColorScheme();
  const isLight = scheme === 'light';

  const backgroundStyle = tone === 'accent'
    ? isLight
      ? styles.accentLight
      : styles.accentDark
    : isLight
      ? styles.defaultLight
      : styles.defaultDark;

  return (
    <Pressable
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        backgroundStyle,
        pressed && styles.pressed,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={70} tint={isLight ? 'light' : 'dark'} style={styles.blurFill} />
      ) : null}
      <View style={styles.highlightLayer} pointerEvents="none" />
      <View style={styles.content}>{icon}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: 'hidden',
    ...Layout.shadow.ios,
    ...Layout.shadow.android,
  },
  blurFill: {
    ...StyleSheet.absoluteFillObject,
  },
  highlightLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultDark: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.32)',
  },
  defaultLight: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderColor: 'rgba(15,23,42,0.16)',
  },
  accentDark: {
    backgroundColor: 'rgba(244,217,107,0.26)',
    borderColor: 'rgba(244,217,107,0.72)',
  },
  accentLight: {
    backgroundColor: 'rgba(244,217,107,0.42)',
    borderColor: 'rgba(193,136,12,0.4)',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});
