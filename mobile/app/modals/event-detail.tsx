import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';

export default function EventDetailModal() {
  const params = useLocalSearchParams<{ title?: string; start?: string; end?: string }>();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <GlassCard>
          <Text style={styles.title}>{params.title || 'Event'}</Text>
          <Text style={styles.text}>Başlangıç: {params.start || '-'}</Text>
          <Text style={styles.text}>Bitiş: {params.end || '-'}</Text>
        </GlassCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    color: Colors.glassText,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  text: {
    color: Colors.glassSubtext,
    marginBottom: 8,
  },
});
