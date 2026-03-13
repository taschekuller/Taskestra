import * as Haptics from 'expo-haptics';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'surface';
  size?: 'sm' | 'md';
}

export const GlassButton = ({
  title,
  onPress,
  disabled,
  icon,
  style,
  variant = 'surface',
  size = 'md',
}: GlassButtonProps) => {
  const variantStyle = variant === 'primary'
    ? styles.primary
    : variant === 'secondary'
      ? styles.secondary
      : styles.surface;

  const textStyle = variant === 'primary' ? styles.primaryText : styles.defaultText;

  return (
    <Pressable
      disabled={disabled}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        size === 'sm' ? styles.sm : styles.md,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View pointerEvents="none" style={styles.highlightLayer} />
      <View style={styles.row}>
        {icon}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Layout.radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    overflow: 'hidden',
    ...Layout.shadow.ios,
    ...Layout.shadow.android,
  },
  md: {
    minHeight: 50,
  },
  sm: {
    minHeight: 38,
  },
  primary: {
    backgroundColor: 'rgba(79,140,255,0.9)',
    borderColor: 'rgba(167,201,255,0.74)',
  },
  secondary: {
    backgroundColor: Colors.surface.level3,
    borderColor: Colors.border.strong,
  },
  surface: {
    backgroundColor: Colors.surface.level2,
    borderColor: Colors.border.soft,
  },
  highlightLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    ...Layout.type.bodyStrong,
    fontWeight: '600',
  },
  defaultText: {
    color: Colors.text.primary,
  },
  primaryText: {
    color: '#F8FBFF',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.48,
  },
});
