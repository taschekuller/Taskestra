import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Sayfa bulunamadı</Text>
        <Link href="/(tabs)" asChild>
          <GlassButton title="Ana Sayfaya Dön" onPress={() => {}} />
        </Link>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    color: Colors.glassText,
    fontSize: 22,
    fontWeight: '700',
  },
});
