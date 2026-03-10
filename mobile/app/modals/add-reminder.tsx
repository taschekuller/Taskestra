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
import { useReminderStore } from '@/store/useReminderStore';
import { toProject, toReminder, type RepeatType } from '@/types/models';

const repeatTypes: RepeatType[] = ['none', 'daily', 'weekly', 'monthly'];

const getRepeatPreview = (repeatType: RepeatType, date: Date) => {
  if (repeatType === 'none') {
    return `Tek seferlik: ${format(date, 'd MMM yyyy HH:mm')}`;
  }

  if (repeatType === 'daily') {
    return `Her gün ${format(date, 'HH:mm')}`;
  }

  if (repeatType === 'weekly') {
    return `Her hafta ${format(date, 'EEEE HH:mm')}`;
  }

  return `Her ay ${format(date, 'd')} günü ${format(date, 'HH:mm')}`;
};

export default function AddReminderModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const reminderRecords = useReminderStore((state) => state.reminders);
  const addReminder = useReminderStore((state) => state.addReminder);
  const updateReminder = useReminderStore((state) => state.updateReminder);

  const projects = useProjectStore((state) => state.projects).map(toProject);

  const existingReminder = useMemo(() => {
    if (!params.id) {
      return undefined;
    }

    const found = reminderRecords.find((item) => item.id === params.id);
    return found ? toReminder(found) : undefined;
  }, [params.id, reminderRecords]);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDateInput, setDueDateInput] = useState(format(new Date(), 'yyyy-MM-dd HH:mm'));
  const [projectId, setProjectId] = useState<string | undefined>();
  const [repeatType, setRepeatType] = useState<RepeatType>('none');

  useEffect(() => {
    if (!existingReminder) {
      return;
    }

    setTitle(existingReminder.title);
    setNotes(existingReminder.notes || '');
    setDueDateInput(format(existingReminder.dueDate, 'yyyy-MM-dd HH:mm'));
    setProjectId(existingReminder.projectId);
    setRepeatType(existingReminder.repeatType);
  }, [existingReminder]);

  const parsedDate = useMemo(() => parse(dueDateInput, 'yyyy-MM-dd HH:mm', new Date()), [dueDateInput]);
  const repeatPreview = useMemo(
    () => (isValid(parsedDate) ? getRepeatPreview(repeatType, parsedDate) : 'Geçerli tarih girin'),
    [parsedDate, repeatType],
  );

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Eksik Alan', 'Hatırlatıcı başlığı zorunludur.');
      return;
    }

    if (!isValid(parsedDate)) {
      Alert.alert('Tarih Hatası', 'Tarih formatı: YYYY-MM-DD HH:mm');
      return;
    }

    if (existingReminder) {
      await updateReminder(existingReminder.id, {
        title,
        notes,
        projectId,
        dueDate: parsedDate,
        repeatType,
      });
    } else {
      await addReminder({
        title,
        notes,
        projectId,
        dueDate: parsedDate,
        repeatType,
      });
    }

    router.back();
  };

  return (
    <GradientBackground>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.container}>
          <SectionHeader title="Reminder Details" />
          <GlassCard>
            <GlassInput
              label="Başlık"
              value={title}
              onChangeText={setTitle}
              placeholder="Reminder başlığı"
              containerStyle={styles.field}
            />
            <GlassInput
              label="Notlar"
              value={notes}
              onChangeText={setNotes}
              placeholder="Opsiyonel"
              multiline
              numberOfLines={4}
              style={styles.multiline}
            />
          </GlassCard>

          <SectionHeader title="Schedule" />
          <GlassCard>
            <GlassInput
              label="Tarih (YYYY-MM-DD HH:mm)"
              value={dueDateInput}
              onChangeText={setDueDateInput}
              keyboardType="numbers-and-punctuation"
            />
            <Text style={styles.helper}>{repeatPreview}</Text>
          </GlassCard>

          <SectionHeader title="Repeat" />
          <GlassCard>
            <View style={styles.chipWrap}>
              {repeatTypes.map((value) => (
                <Chip
                  key={value}
                  label={value.toUpperCase()}
                  selected={repeatType === value}
                  onPress={() => setRepeatType(value)}
                />
              ))}
            </View>
          </GlassCard>

          <SectionHeader title="Project" />
          <GlassCard>
            <View style={styles.chipWrap}>
              <Chip label="Yok" selected={!projectId} onPress={() => setProjectId(undefined)} />

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
            <GlassButton title={existingReminder ? 'Güncelle' : 'Kaydet'} onPress={() => void onSave()} variant="primary" style={styles.actionBtn} />
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
