import { useRouter } from 'expo-router';
import { isToday } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReminderItem } from '@/components/reminders/ReminderItem';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { LiquidFab } from '@/components/ui/LiquidFab';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getReminderLists } from '@/constants/ReminderLists';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useNoteStore } from '@/store/useNoteStore';
import { useReminderStore } from '@/store/useReminderStore';
import { toReminder } from '@/types/models';

export default function RemindersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const reminderRecords = useReminderStore((state) => state.reminders);
  const toggleReminderCompletion = useReminderStore((state) => state.toggleReminderCompletion);
  const deleteReminder = useReminderStore((state) => state.deleteReminder);
  const folderRecords = useNoteStore((state) => state.folders);

  const [showCompleted, setShowCompleted] = useState(false);
  const [todayExpanded, setTodayExpanded] = useState(false);

  const reminders = useMemo(
    () => reminderRecords.map(toReminder).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [reminderRecords],
  );

  const activeReminders = reminders.filter((item) => !item.isCompleted);
  const completedReminders = reminders.filter((item) => item.isCompleted);
  const todayReminders = activeReminders.filter((item) => isToday(item.dueDate));
  const nonTodayActive = activeReminders.filter((item) => !isToday(item.dueDate));
  const workFolderColor = useMemo(
    () => folderRecords.find((folder) => folder.name.trim().toLowerCase() === 'work')?.color,
    [folderRecords],
  );
  const reminderLists = useMemo(() => getReminderLists(workFolderColor), [workFolderColor]);

  const hasTodayOverflow = todayReminders.length > 3;
  const todayCollapsed = todayReminders.slice(0, 3);
  const todayMaxHeight = Math.round(screenHeight * 0.3);
  const todayCollapsedHeight = Math.max(170, Math.min(todayMaxHeight, 238));

  const todayHeight = useSharedValue(todayCollapsedHeight);
  const todayAnimatedStyle = useAnimatedStyle(() => ({
    height: todayHeight.value,
  }));

  useEffect(() => {
    if (!hasTodayOverflow) {
      todayHeight.value = todayCollapsedHeight;
      return;
    }

    todayHeight.value = withTiming(todayExpanded ? todayMaxHeight : todayCollapsedHeight, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });
  }, [hasTodayOverflow, todayCollapsedHeight, todayExpanded, todayHeight, todayMaxHeight]);

  const groupedUpcoming = useMemo(
    () => reminderLists.map((list) => ({
      list,
      reminders: nonTodayActive.filter((item) => item.listKey === list.key),
    })).filter((group) => group.reminders.length > 0),
    [nonTodayActive, reminderLists],
  );

  const onOpenReminderMenu = (id: string, isCompletedItem = false) => {
    Alert.alert('Reminder', 'Choose an action', [
      ...(isCompletedItem
        ? []
        : [
            {
              text: 'Edit',
              onPress: () => router.push(`/modals/add-reminder?id=${id}`),
            } as const,
          ]),
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteReminder(id);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + Layout.spacing.xs }]}>
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>Today first. Lists next.</Text>

        <View style={styles.content}>
          <View style={styles.todaySection}>
            <View style={styles.todayHeaderRow}>
              <SectionHeader title="Today" count={todayReminders.length} />
              {hasTodayOverflow ? (
                <Pressable style={styles.toggleButton} onPress={() => setTodayExpanded((value) => !value)}>
                  <Text style={styles.toggleText}>{todayExpanded ? 'Show less' : 'Show all'}</Text>
                  <Ionicons name={todayExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.text.secondary} />
                </Pressable>
              ) : null}
            </View>

            {todayReminders.length === 0 ? (
              <EmptyStateCard
                title="No reminders for today"
                description="Add one and keep your day focused."
                ctaLabel="Add Reminder"
                onCtaPress={() => router.push('/modals/add-reminder')}
                iconName="alarm-outline"
              />
            ) : hasTodayOverflow ? (
              <Animated.View style={[styles.todayAccordion, todayAnimatedStyle]}>
                {todayExpanded ? (
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.todayListContent}
                  >
                    {todayReminders.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        onComplete={toggleReminderCompletion}
                        onOpenMenu={(itemId) => onOpenReminderMenu(itemId)}
                        compact
                        workColor={workFolderColor}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.todayListContent}>
                    {todayCollapsed.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        onComplete={toggleReminderCompletion}
                        onOpenMenu={(itemId) => onOpenReminderMenu(itemId)}
                        compact
                        workColor={workFolderColor}
                      />
                    ))}
                  </View>
                )}
              </Animated.View>
            ) : (
              <View style={styles.todayListContent}>
                {todayReminders.map((reminder) => (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={toggleReminderCompletion}
                    onOpenMenu={(itemId) => onOpenReminderMenu(itemId)}
                    compact
                    workColor={workFolderColor}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.listSection}>
            <SectionHeader title="By List" count={groupedUpcoming.length} />
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listScrollContent}
            >
              {groupedUpcoming.length === 0 ? (
                <EmptyStateCard
                  title="No upcoming reminders"
                  description="Create reminders and assign them to lists."
                  ctaLabel="Add Reminder"
                  onCtaPress={() => router.push('/modals/add-reminder')}
                  iconName="calendar-outline"
                />
              ) : (
                groupedUpcoming.map((group) => (
                  <View key={group.list.key} style={styles.groupBlock}>
                    <View style={styles.groupHeader}>
                      <View style={[styles.groupDot, { backgroundColor: group.list.tint }]} />
                      <Text style={styles.groupTitle}>{group.list.label}</Text>
                      <Text style={styles.groupCount}>{group.reminders.length}</Text>
                    </View>

                    {group.reminders.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        onComplete={toggleReminderCompletion}
                        onOpenMenu={(itemId) => onOpenReminderMenu(itemId)}
                        showListTag={false}
                        workColor={workFolderColor}
                      />
                    ))}
                  </View>
                ))
              )}

              <View style={styles.completedSection}>
                <Pressable style={styles.completedToggle} onPress={() => setShowCompleted((value) => !value)}>
                  <Text style={styles.completedToggleText}>
                    Completed ({completedReminders.length}) {showCompleted ? '▲' : '▼'}
                  </Text>
                </Pressable>

                {showCompleted
                  ? completedReminders.map((reminder) => (
                      <ReminderItem
                        key={reminder.id}
                        reminder={reminder}
                        onComplete={toggleReminderCompletion}
                        onOpenMenu={(itemId) => onOpenReminderMenu(itemId, true)}
                        compact
                        workColor={workFolderColor}
                      />
                    ))
                  : null}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={[styles.fabWrap, { bottom: insets.bottom + 90 }]}>
          <LiquidFab
            tone="accent"
            icon={<Ionicons name="add" size={26} color={Colors.noteAccentStrong} />}
            onPress={() => router.push('/modals/add-reminder')}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title1,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginTop: 2,
    marginBottom: Layout.spacing.xs,
  },
  content: {
    flex: 1,
    gap: Layout.spacing.sm,
    paddingBottom: 104,
  },
  todaySection: {
    gap: Layout.spacing.xs,
  },
  todayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleButton: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
  todayAccordion: {
    overflow: 'hidden',
    borderRadius: Layout.radius.md,
  },
  todayListContent: {
    paddingBottom: 2,
  },
  listSection: {
    flex: 1,
    gap: Layout.spacing.xs,
  },
  listScrollContent: {
    paddingBottom: 24,
    gap: Layout.spacing.sm,
  },
  groupBlock: {
    gap: Layout.spacing.xxs,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.xxs,
  },
  groupDot: {
    width: 10,
    height: 10,
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    borderColor: Colors.border.soft,
  },
  groupTitle: {
    color: Colors.text.primary,
    ...Layout.type.caption,
    fontWeight: '700',
    flex: 1,
  },
  groupCount: {
    color: Colors.text.tertiary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
  completedSection: {
    marginTop: Layout.spacing.xs,
    gap: Layout.spacing.xs,
  },
  completedToggle: {
    alignSelf: 'flex-start',
  },
  completedToggleText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '700',
  },
  fabWrap: {
    position: 'absolute',
    right: Layout.spacing.md,
  },
});
