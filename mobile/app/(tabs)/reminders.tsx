import { useRouter } from 'expo-router';
import { isAfter, isToday, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProjectTabs } from '@/components/reminders/ProjectTabs';
import { ReminderItem } from '@/components/reminders/ReminderItem';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useProjectStore } from '@/store/useProjectStore';
import { useReminderStore } from '@/store/useReminderStore';
import { toProject, toReminder } from '@/types/models';

export default function RemindersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const projectRecords = useProjectStore((state) => state.projects);
  const reminderRecords = useReminderStore((state) => state.reminders);
  const toggleReminderCompletion = useReminderStore((state) => state.toggleReminderCompletion);
  const deleteReminder = useReminderStore((state) => state.deleteReminder);

  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [showCompleted, setShowCompleted] = useState(false);

  const projects = useMemo(() => projectRecords.map(toProject), [projectRecords]);
  const reminders = useMemo(
    () => reminderRecords.map(toReminder).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [reminderRecords],
  );

  const filtered = useMemo(() => {
    if (!selectedProjectId) {
      return reminders;
    }

    return reminders.filter((item) => item.projectId === selectedProjectId);
  }, [reminders, selectedProjectId]);

  const activeReminders = filtered.filter((item) => !item.isCompleted);
  const completedReminders = filtered.filter((item) => item.isCompleted);
  const nowStart = startOfDay(new Date());
  const todayReminders = activeReminders.filter((item) => isToday(item.dueDate));
  const upcomingReminders = activeReminders.filter((item) => isAfter(item.dueDate, nowStart) && !isToday(item.dueDate));

  const resolveProject = (projectId?: string) => {
    const project = projects.find((item) => item.id === projectId);
    return project ? { name: project.name, color: project.color } : {};
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}> 
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>Projene göre filtrele, sonra bugün ve gelecek işlerini tamamla.</Text>

        <ProjectTabs
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <SectionHeader title="Today" count={todayReminders.length} />
            {todayReminders.length === 0 ? (
              <EmptyStateCard
                title="Bugün için reminder yok"
                description="Öncelikli bir hatırlatıcı oluştur ve gününü netleştir."
                ctaLabel="Reminder Ekle"
                onCtaPress={() => router.push('/modals/add-reminder')}
                iconName="alarm-outline"
              />
            ) : (
              todayReminders.map((reminder) => {
                const project = resolveProject(reminder.projectId);

                return (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    projectName={project.name}
                    projectColor={project.color}
                    onComplete={toggleReminderCompletion}
                    onOpenMenu={(id) => {
                      Alert.alert('Hatırlatıcı', 'Ne yapmak istersiniz?', [
                        {
                          text: 'Düzenle',
                          onPress: () => router.push(`/modals/add-reminder?id=${id}`),
                        },
                        {
                          text: 'Sil',
                          style: 'destructive',
                          onPress: () => {
                            void deleteReminder(id);
                          },
                        },
                        { text: 'İptal', style: 'cancel' },
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
                title="Planlanan reminder yok"
                description="Bu hafta için birkaç hatırlatıcı ekleyip akışını güçlendir."
                ctaLabel="Reminder Ekle"
                onCtaPress={() => router.push('/modals/add-reminder')}
                iconName="calendar-outline"
              />
            ) : (
              upcomingReminders.map((reminder) => {
                const project = resolveProject(reminder.projectId);

                return (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    projectName={project.name}
                    projectColor={project.color}
                    onComplete={toggleReminderCompletion}
                    onOpenMenu={(id) => {
                      Alert.alert('Hatırlatıcı', 'Ne yapmak istersiniz?', [
                        {
                          text: 'Düzenle',
                          onPress: () => router.push(`/modals/add-reminder?id=${id}`),
                        },
                        {
                          text: 'Sil',
                          style: 'destructive',
                          onPress: () => {
                            void deleteReminder(id);
                          },
                        },
                        { text: 'İptal', style: 'cancel' },
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
                  const project = resolveProject(reminder.projectId);

                  return (
                    <ReminderItem
                      key={reminder.id}
                      reminder={reminder}
                      projectName={project.name}
                      projectColor={project.color}
                      onComplete={toggleReminderCompletion}
                      onOpenMenu={(id) => {
                        Alert.alert('Hatırlatıcı', 'Ne yapmak istersiniz?', [
                          {
                            text: 'Sil',
                            style: 'destructive',
                            onPress: () => {
                              void deleteReminder(id);
                            },
                          },
                          { text: 'Kapat', style: 'cancel' },
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
            title="Yeni Reminder"
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
