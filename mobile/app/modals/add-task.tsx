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
import { useProjectStore } from '@/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { toProject, toTask, type Priority } from '@/types/models';

const priorities: Priority[] = ['low', 'medium', 'high'];

export default function AddTaskModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const taskRecords = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const projectRecords = useProjectStore((state) => state.projects);
  const projects = useMemo(() => projectRecords.map(toProject), [projectRecords]);

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
  const [projectId, setProjectId] = useState<string | undefined>();
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (!existingTask) {
      return;
    }

    setTitle(existingTask.title);
    setDescription(existingTask.description || '');
    setDueDateInput(format(existingTask.dueDate, 'yyyy-MM-dd HH:mm'));
    setProjectId(existingTask.projectId);
    setPriority(existingTask.priority);
  }, [existingTask]);

  const onSave = () => {
    if (!title.trim()) {
      Alert.alert('Eksik Alan', 'Görev başlığı zorunludur.');
      return;
    }

    const parsedDate = parse(dueDateInput, 'yyyy-MM-dd HH:mm', new Date());
    if (!isValid(parsedDate)) {
      Alert.alert('Tarih Hatası', 'Tarih formatı: YYYY-MM-DD HH:mm');
      return;
    }

    if (existingTask) {
      updateTask(existingTask.id, {
        title,
        description,
        projectId,
        dueDate: parsedDate,
        priority,
      });
    } else {
      addTask({
        title,
        description,
        projectId,
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
              label="Başlık"
              value={title}
              onChangeText={setTitle}
              placeholder="Görev başlığı"
              containerStyle={styles.field}
            />

            <GlassInput
              label="Açıklama"
              value={description}
              onChangeText={setDescription}
              placeholder="Opsiyonel detay"
              multiline
              numberOfLines={4}
              style={styles.multiline}
            />
          </GlassCard>

          <SectionHeader title="Schedule" />
          <GlassCard>
            <GlassInput
              label="Bitiş Tarihi (YYYY-MM-DD HH:mm)"
              value={dueDateInput}
              onChangeText={setDueDateInput}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.helper}>Örn: 2026-03-12 09:30</Text>
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

          <SectionHeader title="Project" />
          <GlassCard>
            <View style={styles.chipWrap}>
              <Chip
                label="Yok"
                selected={!projectId}
                onPress={() => setProjectId(undefined)}
              />

              {projects.map((project) => (
                <Chip
                  key={project.id}
                  label={project.name}
                  selected={projectId === project.id}
                  onPress={() => setProjectId(project.id)}
                  accentColor={project.color}
                />
              ))}
            </View>
          </GlassCard>
        </ScrollView>

        <BottomActionBar>
          <View style={styles.actionRow}>
            <GlassButton title="İptal" onPress={() => router.back()} variant="secondary" style={styles.actionBtn} />
            <GlassButton title={existingTask ? 'Güncelle' : 'Kaydet'} onPress={onSave} variant="primary" style={styles.actionBtn} />
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
