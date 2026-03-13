import { StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function GoogleAuthScreen() {
  const { authStrategy, isConnected, isLoading, redirectUri, signIn, signOut } = useGoogleAuth();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <GlassCard>
          <Text style={styles.title}>Google OAuth (v2 prep)</Text>
          <Text style={styles.text}>Strategy: {authStrategy}</Text>
          <Text style={styles.text}>Redirect URI: {redirectUri}</Text>
          <Text style={styles.text}>Status: {isConnected ? 'Connected' : 'Not connected'}</Text>

          <GlassButton
            title={isConnected ? 'Sign Out' : 'Connect with Google'}
            onPress={() => {
              if (isConnected) {
                void signOut();
              } else {
                void signIn();
              }
            }}
            disabled={isLoading}
          />
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
