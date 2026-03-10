import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface WeekViewProps {
  referenceDate: Date;
}

export const WeekView = ({ referenceDate }: WeekViewProps) => {
  const days = eachDayOfInterval({
    start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
    end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
  });

  return (
    <GlassCard>
      <View style={styles.row}>
        {days.map((day) => (
          <View key={day.toISOString()} style={styles.dayCell}>
            <Text style={styles.dayLabel}>{format(day, 'EE', { locale: tr })}</Text>
            <Text style={styles.dayNumber}>{format(day, 'd')}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Layout.spacing.xxs,
  },
  dayCell: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level1,
    borderRadius: Layout.radius.sm,
    paddingVertical: Layout.spacing.xs,
    flex: 1,
    gap: Layout.spacing.xxs,
  },
  dayLabel: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    textTransform: 'capitalize',
  },
  dayNumber: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '700',
  },
});
