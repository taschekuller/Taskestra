import { format } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';

import { TaskItem } from '@/components/overview/TaskItem';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import type { Task } from '@/types/models';

export interface WeeklyGroup {
  date: Date;
  tasks: Task[];
}

interface WeeklySectionProps {
  groups: WeeklyGroup[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  now?: Date;
  onCreateTask?: () => void;
}

export const WeeklySection = ({
  groups,
  onToggleTask,
  onDeleteTask,
  now = new Date(),
  onCreateTask,
}: WeeklySectionProps) => {
  const totalCount = groups.reduce((sum, group) => sum + group.tasks.length, 0);

  return (
    <View style={styles.container}>
      <SectionHeader title="This Week" count={totalCount} />

      {groups.length === 0 ? (
        <EmptyStateCard
          title="No tasks planned this week"
          description="Add tasks to build a clear weekly focus list."
          ctaLabel="Add Task"
          onCtaPress={onCreateTask}
          iconName="calendar-outline"
        />
      ) : (
        groups.map((group) => (
          <View key={group.date.toISOString()} style={styles.group}>
            <Text style={styles.groupTitle}>{format(group.date, 'EEEE, d MMMM')}</Text>

            {group.tasks.map((task) => {
              const isOverdue = !task.isCompleted && task.dueDate.getTime() < now.getTime();

              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  isOverdue={isOverdue}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              );
            })}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.spacing.xl,
    paddingBottom: 120,
    gap: Layout.spacing.xs,
  },
  group: {
    marginBottom: Layout.spacing.md,
  },
  groupTitle: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '700',
    marginBottom: Layout.spacing.xs,
    textTransform: 'capitalize',
  },
});
