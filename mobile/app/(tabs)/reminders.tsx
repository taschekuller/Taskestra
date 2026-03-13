import { useRouter } from 'expo-router';
import { isAfter, isToday, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReminderItem } from '@/components/reminders/ReminderItem';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useReminderStore } from '@/store/useReminderStore';
import { toReminder } from '@/types/models';

export default function RemindersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const reminderRecords = useReminderStore((state) => state.reminders);
  const toggleReminderCompletion = useReminderStore((state) => state.toggleReminderCompletion);
  const deleteReminder = useReminderStore((state) => state.deleteReminder);

  const [showCompleted, setShowCompleted] = useState(false);

  const reminders = useMemo(
    () => reminderRecords.map(toReminder).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [reminderRecords],
  );

  const activeReminders = reminders.filter((item) => !item.isCompleted);
  const completedReminders = reminders.filter((item) => item.isCompleted);
  const nowStart = startOfDay(new Date());
  const todayReminders = activeReminders.filter((item) => isToday(item.dueDate));
  const upcomingReminders = activeReminders.filter((item) => isAfter(item.dueDate, nowStart) && !isToday(item.dueDate));

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}> 
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>Track today, upcoming, and completed reminders.</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <SectionHeader title="Today" count={todayReminders.length} />
            {todayReminders.length === 0 ? (
              <EmptyStateCard
                title="No reminders for today"
                description="Create a reminder to keep your day focused."
                ctaLabel="Add Reminder"
                onCtaPress={() => router.push('/modals/add-reminder')}
                iconName="alarm-outline"
              />
            ) : (
              todayReminders.map((reminder) => {
                return (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={toggleReminderCompletion}
                    onOpenMenu={(id) => {
                      Alert.alert('Reminder', 'What do you want to do?', [
                        {
                          text: 'Edit',
                          onPress: () => router.push(`/modals/add-reminder?id=${id}`),
                        },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            void deleteReminder(id);
                          },
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    }}
                  />
                );
              })
            )}
          </View>

          <View style={styles.section}>
            <SectionHeader title="Upcoming" count={upcomingReminders.length} />
            {upcomingReminders.length === 0 ? (
              <EmptyStateCard
                title="No upcoming reminders"
                description="Add a few reminders for this week."
                ctaLabel="Add Reminder"
                onCtaPress={() => router.push('/modals/add-reminder')}
                iconName="calendar-outline"
              />
            ) : (
              upcomingReminders.map((reminder) => {
                return (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={toggleReminderCompletion}
                    onOpenMenu={(id) => {
                      Alert.alert('Reminder', 'What do you want to do?', [
                        {
                          text: 'Edit',
                          onPress: () => router.push(`/modals/add-reminder?id=${id}`),
                        },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            void deleteReminder(id);
                          },
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    }}
                  />
                );
              })
            )}
          </View>

          <View style={styles.section}>
            <Pressable style={styles.completedToggle} onPress={() => setShowCompleted((value) => !value)}>
              <Text style={styles.completedToggleText}>
                Completed ({completedReminders.length}) {showCompleted ? '▲' : '▼'}
              </Text>
            </Pressable>

            {showCompleted
              ? completedReminders.map((reminder) => {
                  return (
                    <ReminderItem
                      key={reminder.id}
                      reminder={reminder}
                      onComplete={toggleReminderCompletion}
                      onOpenMenu={(id) => {
                        Alert.alert('Reminder', 'What do you want to do?', [
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                              void deleteReminder(id);
                            },
                          },
                          { text: 'Close', style: 'cancel' },
                        ]);
                      }}
                    />
                  );
                })
              : null}
          </View>
        </ScrollView>

        <BottomActionBar>
          <GlassButton
            title="Add Reminder"
            onPress={() => router.push('/modals/add-reminder')}
            icon={<Ionicons name="add" size={20} color={Colors.glassText} />}
            variant="primary"
          />
        </BottomActionBar>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title1,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginTop: Layout.spacing.xxs,
    marginBottom: Layout.spacing.sm,
  },
  scrollContent: {
    paddingTop: Layout.spacing.md,
    paddingBottom: 180,
    gap: Layout.spacing.md,
  },
  section: {
    gap: Layout.spacing.xs,
  },
  completedToggle: {
    marginTop: Layout.spacing.xxs,
    alignSelf: 'flex-start',
  },
  completedToggleText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '700',
  },
});
