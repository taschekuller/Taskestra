import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const scheme = useColorScheme();
  const isLight = scheme === 'light';
  const headerBg = isLight ? '#FAFCFF' : '#0B1220';
  const headerText = isLight ? '#0F172A' : '#F4F7FF';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: headerBg },
            headerTitleStyle: { color: headerText, fontSize: 16, fontWeight: '700' },
            headerTintColor: headerText,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: headerBg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="modals/add-task"
            options={{ title: 'New Task', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/add-reminder"
            options={({ route }) => ({
              title: (route.params as { id?: string } | undefined)?.id ? 'Edit Reminder' : 'New Reminder',
              presentation: 'modal',
            })}
          />
          <Stack.Screen
            name="modals/add-note"
            options={({ route }) => ({
              title: (route.params as { noteId?: string } | undefined)?.noteId ? 'Edit Note' : 'New Note',
              presentation: 'modal',
            })}
          />
          <Stack.Screen
            name="modals/add-folder"
            options={{ title: 'Folder', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/event-detail"
            options={{ title: 'Event Details', presentation: 'modal' }}
          />
          <Stack.Screen
            name="modals/settings"
            options={{ title: 'Settings', presentation: 'modal' }}
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
