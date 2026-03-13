import { format } from 'date-fns';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { GlassBadge } from '@/components/ui/GlassBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { getReminderListMap } from '@/constants/ReminderLists';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import type { Reminder } from '@/types/models';

interface ReminderItemProps {
  reminder: Reminder;
  onComplete: (id: string) => void;
  onOpenMenu: (id: string) => void;
  compact?: boolean;
  showListTag?: boolean;
  workColor?: string;
}

const repeatLabel: Record<Reminder['repeatType'], string> = {
  none: 'No repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const ReminderItem = ({
  reminder,
  onComplete,
  onOpenMenu,
  compact = false,
  showListTag = true,
  workColor,
}: ReminderItemProps) => {
  const listMap = getReminderListMap(workColor);
  const listMeta = listMap[reminder.listKey];

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.swipeAction}>
          <Ionicons name="checkmark-done" color={Colors.glassText} size={20} />
          <Text style={styles.swipeText}>Complete</Text>
        </View>
      )}
      onSwipeableOpen={() => onComplete(reminder.id)}
    >
      <Pressable onLongPress={() => onOpenMenu(reminder.id)} delayLongPress={260}>
        <GlassCard
          style={[styles.card, compact && styles.cardCompact]}
          contentStyle={compact && styles.compactContent}
        >
          <View style={styles.row}>
            <View style={styles.content}>
              <Text style={[styles.title, reminder.isCompleted && styles.completedTitle]}>{reminder.title}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{format(reminder.dueDate, 'd MMM HH:mm')}</Text>
                {showListTag ? (
                  <View style={[styles.listTag, { backgroundColor: listMeta.tint, borderColor: listMeta.borderColor }]}>
                    <Ionicons name={listMeta.icon as keyof typeof Ionicons.glyphMap} size={12} color={Colors.text.secondary} />
                    <Text style={styles.listTagText}>{listMeta.label}</Text>
                  </View>
                ) : null}
              </View>

              <GlassBadge label={repeatLabel[reminder.repeatType]} tone="neutral" style={compact && styles.compactBadge} />
            </View>

            <Pressable hitSlop={10} onPress={() => onComplete(reminder.id)}>
              <Ionicons
                name={reminder.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={24}
                color={reminder.isCompleted ? Colors.success : Colors.glassSubtext}
              />
            </Pressable>
          </View>
        </GlassCard>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Layout.spacing.xs,
  },
  cardCompact: {
    marginBottom: Layout.spacing.xxs,
  },
  compactContent: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Layout.spacing.sm,
  },
  content: {
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
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  metaText: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
  },
  listTag: {
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listTagText: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    fontWeight: '600',
  },
  compactBadge: {
    paddingVertical: 2,
  },
  swipeAction: {
    backgroundColor: 'rgba(79,140,255,0.34)',
    borderRadius: Layout.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 92,
    marginBottom: Layout.spacing.xs,
    gap: Layout.spacing.xxs,
    borderWidth: 1,
    borderColor: 'rgba(79,140,255,0.45)',
  },
  swipeText: {
    color: Colors.text.primary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
});
