import { Ionicons } from '@expo/vector-icons';
import {
  addMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventCard } from '@/components/calendar/EventCard';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { getReminderListMap } from '@/constants/ReminderLists';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useNoteStore } from '@/store/useNoteStore';
import { useReminderStore } from '@/store/useReminderStore';
import { toReminder, type CalendarEvent } from '@/types/models';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthCursor, setMonthCursor] = useState(startOfMonth(new Date()));
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const folderRecords = useNoteStore((state) => state.folders);
  const reminderRecords = useReminderStore((state) => state.reminders);

  const { accessToken, isConnected, isLoading: authLoading, signIn, signOut } = useGoogleAuth();
  const { events, refresh } = useCalendarEvents(accessToken);

  const workFolderColor = useMemo(
    () => folderRecords.find((folder) => folder.name.trim().toLowerCase() === 'work')?.color,
    [folderRecords],
  );
  const reminderListMap = useMemo(() => getReminderListMap(workFolderColor), [workFolderColor]);

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    void refresh(weekStart, weekEnd);
  }, [refresh, selectedDate]);

  const reminderTimelineEvents = useMemo<CalendarEvent[]>(() => {
    return reminderRecords
      .map(toReminder)
      .filter((reminder) => !reminder.isCompleted)
      .map((reminder) => ({
        id: `local-${reminder.id}`,
        title: reminder.title,
        startDate: reminder.dueDate,
        endDate: addMinutes(reminder.dueDate, 45),
        googleCalendarId: 'local',
        color: reminderListMap[reminder.listKey].borderColor,
      }));
  }, [reminderListMap, reminderRecords]);

  const mergedEvents = useMemo(() => {
    if (events.length > 0) {
      return [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    return [...reminderTimelineEvents].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events, reminderTimelineEvents]);

  const weekDays = useMemo(
    () => eachDayOfInterval({
      start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
      end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
    }),
    [selectedDate],
  );

  const eventCountByDay = useMemo(() => {
    const map = new Map<string, number>();

    mergedEvents.forEach((event) => {
      const key = format(event.startDate, 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + 1);
    });

    return map;
  }, [mergedEvents]);

  const selectedDayEvents = useMemo(
    () => mergedEvents.filter((event) => isSameDay(event.startDate, selectedDate)),
    [mergedEvents, selectedDate],
  );

  const monthGridDays = useMemo(() => {
    const monthStart = startOfMonth(monthCursor);
    const monthEnd = endOfMonth(monthCursor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [monthCursor]);

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Calendar</Text>
          <GlassButton
            title={isConnected ? 'Connected' : 'Google'}
            size="sm"
            variant={isConnected ? 'secondary' : 'surface'}
            onPress={() => {
              if (isConnected) {
                void signOut();
                return;
              }
              void signIn();
            }}
            disabled={authLoading}
          />
        </View>

        <GlassCard>
          <Pressable
            style={styles.monthTrigger}
            onPress={() => {
              setMonthCursor(startOfMonth(selectedDate));
              setShowMonthPicker(true);
            }}
          >
            <Text style={styles.monthTriggerText}>{format(selectedDate, 'd MMMM yyyy')}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
          </Pressable>

          <View style={styles.weekRow}>
            {weekDays.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const count = eventCountByDay.get(key) ?? 0;
              const active = isSameDay(day, selectedDate);

              return (
                <Pressable
                  key={key}
                  style={[styles.weekDayCell, active && styles.weekDayCellActive]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text style={[styles.weekDayLabel, active && styles.weekDayLabelActive]}>{format(day, 'EE')}</Text>
                  <Text style={[styles.weekDayDate, active && styles.weekDayLabelActive]}>{format(day, 'd')}</Text>
                  <View style={styles.weekDotsRow}>
                    {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
                      <View key={`${key}-dot-${index}`} style={[styles.weekDot, active && styles.weekDotActive]} />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timelineContainer}
        >
          <SectionHeader title={format(selectedDate, 'EEEE, d MMMM')} count={selectedDayEvents.length} />

          {selectedDayEvents.length === 0 ? (
            <EmptyStateCard
              title="No events for this day"
              description={isConnected ? 'Try another date in this week.' : 'Connect Google or add reminders to populate timeline.'}
              ctaLabel={!isConnected ? 'Connect with Google' : undefined}
              onCtaPress={!isConnected ? () => { void signIn(); } : undefined}
              iconName="calendar-clear-outline"
            />
          ) : (
            selectedDayEvents.map((event) => (
              <View key={event.id} style={styles.timelineRow}>
                <Text style={styles.timelineTime}>{format(event.startDate, 'HH:mm')}</Text>
                <View style={styles.timelineRail}>
                  <View style={[styles.timelineMarker, { backgroundColor: event.color ?? Colors.primary }]} />
                </View>
                <View style={styles.timelineCardWrap}>
                  <EventCard event={event} />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Modal visible={showMonthPicker} transparent animationType="fade" onRequestClose={() => setShowMonthPicker(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowMonthPicker(false)} />

          <GlassCard style={styles.monthPickerCard}>
            <View style={styles.monthPickerHeader}>
              <Pressable style={styles.monthNavBtn} onPress={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                <Ionicons name="chevron-back" size={18} color={Colors.text.primary} />
              </Pressable>
              <Text style={styles.monthPickerTitle}>{format(monthCursor, 'MMMM yyyy')}</Text>
              <Pressable style={styles.monthNavBtn} onPress={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                <Ionicons name="chevron-forward" size={18} color={Colors.text.primary} />
              </Pressable>
            </View>

            <View style={styles.monthWeekLabels}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                <Text key={label} style={styles.monthWeekLabel}>{label}</Text>
              ))}
            </View>

            <View style={styles.monthGrid}>
              {monthGridDays.map((day) => {
                const key = format(day, 'yyyy-MM-dd');
                const count = eventCountByDay.get(key) ?? 0;
                const active = isSameDay(day, selectedDate);
                const inMonth = isSameMonth(day, monthCursor);

                return (
                  <Pressable
                    key={key}
                    style={[styles.monthCell, active && styles.monthCellActive]}
                    onPress={() => {
                      setSelectedDate(day);
                      setShowMonthPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.monthCellText,
                        !inMonth && styles.monthCellTextMuted,
                        active && styles.monthCellTextActive,
                        isToday(day) && !active && styles.monthCellTextToday,
                      ]}
                    >
                      {format(day, 'd')}
                    </Text>
                    {count > 0 ? <View style={styles.monthCellDot} /> : null}
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title1,
    fontWeight: '800',
  },
  monthTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  monthTriggerText: {
    color: Colors.text.primary,
    ...Layout.type.title3,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  weekDayCell: {
    flex: 1,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level1,
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xs,
  },
  weekDayCellActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(79,140,255,0.2)',
  },
  weekDayLabel: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    textTransform: 'capitalize',
  },
  weekDayDate: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '700',
  },
  weekDayLabelActive: {
    color: Colors.text.primary,
  },
  weekDotsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
    minHeight: 5,
  },
  weekDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.text.tertiary,
  },
  weekDotActive: {
    backgroundColor: Colors.text.primary,
  },
  timelineContainer: {
    paddingBottom: 140,
    gap: Layout.spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.xs,
  },
  timelineTime: {
    width: 46,
    color: Colors.text.secondary,
    ...Layout.type.meta,
    marginTop: 10,
    textAlign: 'right',
  },
  timelineRail: {
    width: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  timelineMarker: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.soft,
  },
  timelineCardWrap: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.md,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.55)',
  },
  monthPickerCard: {
    maxHeight: '78%',
  },
  monthPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface.level2,
  },
  monthPickerTitle: {
    color: Colors.text.primary,
    ...Layout.type.title3,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  monthWeekLabels: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.xs,
  },
  monthWeekLabel: {
    flex: 1,
    textAlign: 'center',
    color: Colors.text.tertiary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthCell: {
    width: '14.2857%',
    aspectRatio: 1,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface.level1,
  },
  monthCellActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(79,140,255,0.2)',
  },
  monthCellText: {
    color: Colors.text.primary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
  monthCellTextMuted: {
    color: Colors.text.tertiary,
  },
  monthCellTextActive: {
    color: Colors.text.primary,
  },
  monthCellTextToday: {
    color: Colors.primary,
  },
  monthCellDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
});
