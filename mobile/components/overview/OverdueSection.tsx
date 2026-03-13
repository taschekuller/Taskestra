import { StyleSheet, View } from 'react-native';

import { TaskItem } from '@/components/overview/TaskItem';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Layout } from '@/constants/Layout';
import type { Task } from '@/types/models';

interface OverdueSectionProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask?: () => void;
}

export const OverdueSection = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onCreateTask,
}: OverdueSectionProps) => {
  return (
    <View style={styles.container}>
      <SectionHeader title="Overdue" count={tasks.length} />

      {tasks.length === 0 ? (
        <EmptyStateCard
          title="No overdue tasks"
          description="Great progress. Add a new task to keep momentum."
          ctaLabel="Add Task"
          onCtaPress={onCreateTask}
          iconName="checkmark-done-outline"
        />
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isOverdue
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.spacing.lg,
    gap: Layout.spacing.xs,
  },
});
