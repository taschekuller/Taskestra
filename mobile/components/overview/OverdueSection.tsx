import { StyleSheet, View } from 'react-native';

import { TaskItem } from '@/components/overview/TaskItem';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Layout } from '@/constants/Layout';
import type { Task } from '@/types/models';

interface OverdueSectionProps {
  tasks: Task[];
  resolveProject: (projectId?: string) => { name?: string; color?: string };
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask?: () => void;
}

export const OverdueSection = ({
  tasks,
  resolveProject,
  onToggleTask,
  onDeleteTask,
  onCreateTask,
}: OverdueSectionProps) => {
  return (
    <View style={styles.container}>
      <SectionHeader title="Overdue" count={tasks.length} />

      {tasks.length === 0 ? (
        <EmptyStateCard
          title="Overdue görev bulunmuyor"
          description="Harika gidiyorsun. Yeni görev ekleyerek planını güncel tut."
          ctaLabel="Yeni Task"
          onCtaPress={onCreateTask}
          iconName="checkmark-done-outline"
        />
      ) : (
        tasks.map((task) => {
          const project = resolveProject(task.projectId);

          return (
            <TaskItem
              key={task.id}
              task={task}
              projectName={project.name}
              projectColor={project.color}
              isOverdue
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          );
        })
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
