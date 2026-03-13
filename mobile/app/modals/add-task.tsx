import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, isValid, parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { Chip } from '@/components/ui/Chip';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useTaskStore } from '@/store/useTaskStore';
import { toTask, type Priority } from '@/types/models';

const priorities: Priority[] = ['low', 'medium', 'high'];

export default function AddTaskModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const taskRecords = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const existingTask = useMemo(() => {
    if (!params.id) {
      return undefined;
    }

    const found = taskRecords.find((task) => task.id === params.id);
    return found ? toTask(found) : undefined;
  }, [params.id, taskRecords]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateInput, setDueDateInput] = useState(format(new Date(), 'yyyy-MM-dd HH:mm'));
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (!existingTask) {
      return;
    }

    setTitle(existingTask.title);
    setDescription(existingTask.description || '');
    setDueDateInput(format(existingTask.dueDate, 'yyyy-MM-dd HH:mm'));
    setPriority(existingTask.priority);
  }, [existingTask]);

  const onSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Task title is required.');
      return;
    }

    const parsedDate = parse(dueDateInput, 'yyyy-MM-dd HH:mm', new Date());
    if (!isValid(parsedDate)) {
      Alert.alert('Date Error', 'Date format: YYYY-MM-DD HH:mm');
      return;
    }

    if (existingTask) {
      updateTask(existingTask.id, {
        title,
        description,
        dueDate: parsedDate,
        priority,
      });
    } else {
      addTask({
        title,
        description,
        dueDate: parsedDate,
        priority,
      });
    }

    router.back();
  };

  return (
    <GradientBackground>
      <View style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <SectionHeader title="Task Details" />
          <GlassCard>
            <GlassInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Task title"
              containerStyle={styles.field}
            />

            <GlassInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Optional details"
              multiline
              numberOfLines={4}
              style={styles.multiline}
            />
          </GlassCard>

          <SectionHeader title="Schedule" />
          <GlassCard>
            <GlassInput
              label="Due Date (YYYY-MM-DD HH:mm)"
              value={dueDateInput}
              onChangeText={setDueDateInput}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.helper}>Example: 2026-03-12 09:30</Text>
          </GlassCard>

          <SectionHeader title="Priority" />
          <GlassCard>
            <View style={styles.chipWrap}>
              {priorities.map((value) => (
                <Chip
                  key={value}
                  label={value.toUpperCase()}
                  selected={priority === value}
                  onPress={() => setPriority(value)}
                />
              ))}
            </View>
          </GlassCard>

        </ScrollView>

        <BottomActionBar>
          <View style={styles.actionRow}>
            <GlassButton title="Cancel" onPress={() => router.back()} variant="secondary" style={styles.actionBtn} />
            <GlassButton title={existingTask ? 'Update' : 'Save'} onPress={onSave} variant="primary" style={styles.actionBtn} />
          </View>
        </BottomActionBar>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: Layout.spacing.md,
    gap: Layout.spacing.sm,
    paddingBottom: 140,
  },
  field: {
    marginBottom: Layout.spacing.sm,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  helper: {
    marginTop: Layout.spacing.xs,
    color: Colors.text.tertiary,
    ...Layout.type.meta,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
});
