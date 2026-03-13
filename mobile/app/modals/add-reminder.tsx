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
import { getReminderLists } from '@/constants/ReminderLists';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useNoteStore } from '@/store/useNoteStore';
import { useReminderStore } from '@/store/useReminderStore';
import { toReminder, type ReminderListKey, type RepeatType } from '@/types/models';

const repeatTypes: RepeatType[] = ['none', 'daily', 'weekly', 'monthly'];

const getRepeatPreview = (repeatType: RepeatType, date: Date) => {
  if (repeatType === 'none') {
    return `One-time: ${format(date, 'd MMM yyyy HH:mm')}`;
  }

  if (repeatType === 'daily') {
    return `Every day at ${format(date, 'HH:mm')}`;
  }

  if (repeatType === 'weekly') {
    return `Every week on ${format(date, 'EEEE HH:mm')}`;
  }

  return `Every month on day ${format(date, 'd')} at ${format(date, 'HH:mm')}`;
};

export default function AddReminderModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const reminderRecords = useReminderStore((state) => state.reminders);
  const addReminder = useReminderStore((state) => state.addReminder);
  const updateReminder = useReminderStore((state) => state.updateReminder);
  const folderRecords = useNoteStore((state) => state.folders);

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
  const [listKey, setListKey] = useState<ReminderListKey>('others');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');

  useEffect(() => {
    if (!existingReminder) {
      return;
    }

    setTitle(existingReminder.title);
    setNotes(existingReminder.notes || '');
    setDueDateInput(format(existingReminder.dueDate, 'yyyy-MM-dd HH:mm'));
    setListKey(existingReminder.listKey);
    setRepeatType(existingReminder.repeatType);
  }, [existingReminder]);

  const parsedDate = useMemo(() => parse(dueDateInput, 'yyyy-MM-dd HH:mm', new Date()), [dueDateInput]);
  const repeatPreview = useMemo(
    () => (isValid(parsedDate) ? getRepeatPreview(repeatType, parsedDate) : 'Please enter a valid date'),
    [parsedDate, repeatType],
  );
  const workFolderColor = useMemo(
    () => folderRecords.find((folder) => folder.name.trim().toLowerCase() === 'work')?.color,
    [folderRecords],
  );
  const listOptions = useMemo(
    () => getReminderLists(workFolderColor),
    [workFolderColor],
  );

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Reminder title is required.');
      return;
    }

    if (!isValid(parsedDate)) {
      Alert.alert('Date Error', 'Date format: YYYY-MM-DD HH:mm');
      return;
    }

    if (existingReminder) {
      await updateReminder(existingReminder.id, {
        title,
        notes,
        dueDate: parsedDate,
        listKey,
        repeatType,
      });
    } else {
      await addReminder({
        title,
        notes,
        dueDate: parsedDate,
        listKey,
        repeatType,
      });
    }

    router.back();
  };

  return (
    <GradientBackground>
      <View style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <SectionHeader title="Reminder Details" />
          <GlassCard>
            <GlassInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Reminder title"
              containerStyle={styles.field}
            />
            <GlassInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional"
              multiline
              numberOfLines={4}
              style={styles.multiline}
            />
          </GlassCard>

          <SectionHeader title="Schedule" />
          <GlassCard>
            <GlassInput
              label="Date (YYYY-MM-DD HH:mm)"
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

          <SectionHeader title="List" />
          <GlassCard>
            <View style={styles.chipWrap}>
              {listOptions.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={listKey === option.key}
                  accentColor={option.key === 'work' ? (workFolderColor ?? '#9A7652') : undefined}
                  onPress={() => setListKey(option.key as ReminderListKey)}
                />
              ))}
            </View>
          </GlassCard>

        </ScrollView>

        <BottomActionBar>
          <View style={styles.actionRow}>
            <GlassButton title="Cancel" onPress={() => router.back()} variant="secondary" style={styles.actionBtn} />
            <GlassButton title={existingReminder ? 'Update' : 'Save'} onPress={() => void onSave()} variant="primary" style={styles.actionBtn} />
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
