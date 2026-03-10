import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface MonthViewProps {
  referenceDate: Date;
}

export const MonthView = ({ referenceDate }: MonthViewProps) => {
  const days = eachDayOfInterval({ start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) });

  return (
    <GlassCard>
      <View style={styles.grid}>
        {days.map((day) => (
          <View key={day.toISOString()} style={styles.cell}>
            <Text style={styles.day}>{format(day, 'd')}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xxs,
  },
  cell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: Layout.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level1,
  },
  day: {
    color: Colors.text.primary,
    ...Layout.type.meta,
    fontWeight: '600',
  },
});
