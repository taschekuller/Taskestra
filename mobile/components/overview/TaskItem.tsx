import { format } from 'date-fns';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import type { Task } from '@/types/models';

interface TaskItemProps {
  task: Task;
  isOverdue?: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskItem = ({
  task,
  isOverdue,
  onToggle,
  onDelete,
}: TaskItemProps) => {
  const completedProgress = useSharedValue(task.isCompleted ? 1 : 0);

  useEffect(() => {
    completedProgress.value = withTiming(task.isCompleted ? 1 : 0, { duration: 220 });
  }, [completedProgress, task.isCompleted]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: 1 - completedProgress.value * 0.35,
  }));

  return (
    <GlassCard
      style={[
        styles.card,
        isOverdue && !task.isCompleted && styles.overdueCard,
      ]}
    >
      <View style={styles.row}>
        <Pressable onPress={() => onToggle(task.id)} style={styles.checkbox}>
          <Ionicons
            name={task.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={task.isCompleted ? Colors.success : Colors.glassText}
          />
        </Pressable>

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={[styles.title, task.isCompleted && styles.completedTitle]}>{task.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{format(task.dueDate, 'd MMM HH:mm')}</Text>
          </View>

          {isOverdue && !task.isCompleted ? <GlassBadge label="Overdue" tone="danger" /> : null}
        </Animated.View>

        {onDelete ? (
          <Pressable hitSlop={10} onPress={() => onDelete(task.id)}>
            <Ionicons name="trash-outline" size={18} color={Colors.glassSubtext} />
          </Pressable>
        ) : null}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Layout.spacing.xs,
  },
  overdueCard: {
    borderColor: 'rgba(255,107,107,0.5)',
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.xs,
  },
  checkbox: {
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
    gap: Layout.spacing.xxs,
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '600',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.text.tertiary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
    flexWrap: 'wrap',
  },
  metaText: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
  },
});
