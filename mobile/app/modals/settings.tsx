import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function SettingsModal() {
  const { isConnected, isLoading, signIn, signOut } = useGoogleAuth();

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <SectionHeader title="Integrations" />

        <GlassCard>
          <Text style={styles.cardTitle}>Google Calendar</Text>
          <Text style={styles.cardText}>
            Connect your account to sync read-only events into weekly calendar timeline.
          </Text>
          <Text style={styles.statusText}>
            Status: {isConnected ? 'Connected' : 'Not connected'}
          </Text>

          <GlassButton
            title={isConnected ? 'Disconnect Google Calendar' : 'Connect Google Calendar'}
            onPress={() => {
              if (isConnected) {
                void signOut();
                return;
              }

              void signIn();
            }}
            disabled={isLoading}
            variant="primary"
          />
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    paddingBottom: Layout.spacing.xxl,
  },
  cardTitle: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '700',
    marginBottom: Layout.spacing.xs,
  },
  cardText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginBottom: Layout.spacing.sm,
  },
  statusText: {
    color: Colors.text.tertiary,
    ...Layout.type.meta,
    marginBottom: Layout.spacing.sm,
  },
});
