import { useRouter } from 'expo-router';
import { endOfWeek, eachDayOfInterval, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { OverdueSection } from '@/components/overview/OverdueSection';
import { type WeeklyGroup, WeeklySection } from '@/components/overview/WeeklySection';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useOverdueTasks } from '@/hooks/useOverdueTasks';
import { getTasksByDateRangeFromRecords, useTaskStore } from '@/store/useTaskStore';

export default function OverviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const overdueTasks = useOverdueTasks();

  const taskRecords = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [refreshing, setRefreshing] = useState(false);

  const allTasks = useMemo(() => taskRecords.map((task) => ({ ...task, dueDate: new Date(task.dueDateIso) })), [taskRecords]);
  const todayCount = useMemo(
    () => allTasks.filter((task) => !task.isCompleted && isToday(task.dueDate)).length,
    [allTasks],
  );

  const weeklyGroups = useMemo<WeeklyGroup[]>(() => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const weekTasks = getTasksByDateRangeFromRecords(taskRecords, start, end);

    return days
      .map((day) => ({
        date: day,
        tasks: weekTasks.filter((task) => isSameDay(task.dueDate, day)),
      }))
      .filter((group) => group.tasks.length > 0);
  }, [taskRecords]);
  const weeklyCount = useMemo(
    () => weeklyGroups.reduce((sum, group) => sum + group.tasks.length, 0),
    [weeklyGroups],
  );

  return (
    <GradientBackground>
      <Animated.View entering={FadeIn.duration(300)} style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.container, { paddingTop: insets.top + 12 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor="#fff"
              onRefresh={() => {
                setRefreshing(true);
                setTimeout(() => setRefreshing(false), 700);
              }}
            />
          }
        >
          <ScreenHeader title="Overview" onPressSettings={() => router.push('/modals/settings')} />

          <GlassCard>
            <Text style={styles.greeting}>Today Focus</Text>
            <Text style={styles.dateText}>{format(new Date(), 'd MMMM yyyy, EEEE')}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{overdueTasks.length}</Text>
                <Text style={styles.statLabel}>Overdue</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{todayCount}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{weeklyCount}</Text>
                <Text style={styles.statLabel}>Week</Text>
              </View>
            </View>
          </GlassCard>

          <OverdueSection
            tasks={overdueTasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onCreateTask={() => router.push('/modals/add-task')}
          />

          <WeeklySection
            groups={weeklyGroups}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onCreateTask={() => router.push('/modals/add-task')}
          />
        </ScrollView>

        <View style={[styles.fab, { bottom: insets.bottom + 90 }]}> 
          <GlassButton
            title="Add Task"
            onPress={() => router.push('/modals/add-task')}
            icon={<Ionicons name="add" size={20} color={Colors.glassText} />}
            variant="primary"
          />
        </View>
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: 220,
    gap: Layout.spacing.sm,
  },
  greeting: {
    color: Colors.text.primary,
    ...Layout.type.title2,
    fontWeight: '700',
  },
  dateText: {
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xxs,
    textTransform: 'capitalize',
  },
  statsRow: {
    marginTop: Layout.spacing.md,
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  statItem: {
    flex: 1,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level2,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.text.primary,
    ...Layout.type.title3,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
  },
  fab: {
    position: 'absolute',
    right: Layout.spacing.md,
    left: Layout.spacing.md,
  },
});
