import { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { GlassCard } from '@/components/ui/GlassCard';

interface GlassInputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const GlassInput = forwardRef<TextInput, GlassInputProps>(function GlassInput(
  { label, containerStyle, style, ...props },
  ref,
) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <GlassCard contentStyle={styles.cardContent}>
        <TextInput
          ref={ref}
          placeholderTextColor={Colors.text.tertiary}
          style={[styles.input, style]}
          {...props}
        />
      </GlassCard>
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginBottom: Layout.spacing.xs,
  },
  cardContent: {
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level1,
    paddingVertical: 12,
    paddingHorizontal: Layout.spacing.md,
  },
  input: {
    color: Colors.text.primary,
    ...Layout.type.body,
    minHeight: 22,
  },
});
