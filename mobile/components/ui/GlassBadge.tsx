import { StyleSheet, Text, type StyleProp, type ViewStyle, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface GlassBadgeProps {
  label: string;
  tone?: 'danger' | 'warning' | 'success' | 'neutral';
  style?: StyleProp<ViewStyle>;
}

const toneMap = {
  danger: 'rgba(255,107,107,0.24)',
  warning: 'rgba(255,184,77,0.24)',
  success: 'rgba(56,199,147,0.24)',
  neutral: 'rgba(255,255,255,0.12)',
};

export const GlassBadge = ({ label, tone = 'neutral', style }: GlassBadgeProps) => {
  return (
    <View style={[styles.badge, { backgroundColor: toneMap[tone] }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Layout.radius.pill,
    borderColor: Colors.border.soft,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    color: Colors.text.primary,
    ...Layout.type.meta,
    fontWeight: '600',
  },
});
