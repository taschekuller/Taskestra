import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';

interface EmptyStateCardProps {
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const EmptyStateCard = ({
  title,
  description,
  ctaLabel,
  onCtaPress,
  iconName = 'sparkles-outline',
}: EmptyStateCardProps) => {
  return (
    <GlassCard>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={18} color={Colors.primary} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {ctaLabel && onCtaPress ? (
          <GlassButton title={ctaLabel} onPress={onCtaPress} variant="primary" />
        ) : null}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Layout.spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79,140,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(79,140,255,0.35)',
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
  },
  description: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
  },
});
