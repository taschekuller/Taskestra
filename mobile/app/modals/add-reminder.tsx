import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
type PickerMode = 'date' | 'time' | null;
const LIST_ACCENT_COLORS: Record<ReminderListKey, string> = {
  work: '#9A7652',
  personal: '#ECA581',
  school: '#89A8FF',
  learning: '#81DCB5',
  others: '#94A3B8',
};

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
  const [dueDate, setDueDate] = useState(new Date());
  const [listKey, setListKey] = useState<ReminderListKey>('others');
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  useEffect(() => {
    if (!existingReminder) {
      return;
    }

    setTitle(existingReminder.title);
    setNotes(existingReminder.notes || '');
    setDueDate(existingReminder.dueDate);
    setListKey(existingReminder.listKey);
    setRepeatType(existingReminder.repeatType);
  }, [existingReminder]);

  const repeatPreview = useMemo(
    () => getRepeatPreview(repeatType, dueDate),
    [dueDate, repeatType],
  );
  const workFolderColor = useMemo(
    () => folderRecords.find((folder) => folder.name.trim().toLowerCase() === 'work')?.color,
    [folderRecords],
  );
  const listOptions = useMemo(
    () => getReminderLists(workFolderColor),
    [workFolderColor],
  );

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setPickerMode(null);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    const updated = new Date(dueDate);
    if (pickerMode === 'date') {
      updated.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    } else if (pickerMode === 'time') {
      updated.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    }

    setDueDate(updated);
  };

  const openPicker = (nextMode: Exclude<PickerMode, null>) => {
    setPickerMode((current) => (current === nextMode ? null : nextMode));
  };

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Reminder title is required.');
      return;
    }

    if (repeatType === 'none' && dueDate.getTime() <= Date.now() + 15_000) {
      Alert.alert('Date Error', 'Please choose a future date and time.');
      return;
    }

    if (existingReminder) {
      await updateReminder(existingReminder.id, {
        title,
        notes,
        dueDate,
        listKey,
        repeatType,
      });
    } else {
      await addReminder({
        title,
        notes,
        dueDate,
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
            <Pressable style={styles.scheduleRow} onPress={() => openPicker('date')}>
              <Text style={styles.scheduleLabel}>Date</Text>
              <Text style={styles.scheduleValue}>{format(dueDate, 'EEE, d MMM yyyy')}</Text>
            </Pressable>
            <Pressable style={styles.scheduleRow} onPress={() => openPicker('time')}>
              <Text style={styles.scheduleLabel}>Time</Text>
              <Text style={styles.scheduleValue}>{format(dueDate, 'HH:mm')}</Text>
            </Pressable>
            {pickerMode ? (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={dueDate}
                  mode={pickerMode}
                  display={Platform.OS === 'ios' ? (pickerMode === 'date' ? 'inline' : 'spinner') : 'default'}
                  onChange={onDateChange}
                  minimumDate={repeatType === 'none' ? new Date() : undefined}
                />
              </View>
            ) : null}
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
                  accentColor={option.key === 'work' ? (workFolderColor ?? LIST_ACCENT_COLORS.work) : LIST_ACCENT_COLORS[option.key]}
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
  scheduleRow: {
    minHeight: 44,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level2,
    paddingHorizontal: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xs,
  },
  scheduleLabel: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '700',
  },
  scheduleValue: {
    color: Colors.text.primary,
    ...Layout.type.body,
    fontWeight: '600',
  },
  pickerWrap: {
    borderRadius: Layout.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level2,
    marginBottom: Layout.spacing.xs,
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
