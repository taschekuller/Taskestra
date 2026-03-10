import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="modals/add-task"
            options={{ title: 'Yeni Görev', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/add-reminder"
            options={{ title: 'Yeni Hatırlatıcı', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/add-note"
            options={{ title: 'Not Düzenle', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/add-folder"
            options={{ title: 'Klasör', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/event-detail"
            options={{ title: 'Event Detayı', presentation: 'modal' }}
          />
          <Stack.Screen
            name="auth/google"
            options={{ title: 'Google OAuth', presentation: 'modal' }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
