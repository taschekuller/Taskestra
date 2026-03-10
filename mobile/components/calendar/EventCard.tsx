import { format } from 'date-fns';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import type { CalendarEvent } from '@/types/models';

interface EventCardProps {
  event: CalendarEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <GlassCard style={[styles.card, event.color ? { borderLeftColor: event.color, borderLeftWidth: 4 } : null]}>
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>
            {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
          </Text>
        </View>
        <Text style={styles.time}>{format(event.startDate, 'HH:mm')}</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Layout.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Layout.spacing.sm,
  },
  main: {
    flex: 1,
    gap: Layout.spacing.xxs,
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '600',
  },
  meta: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
  },
  time: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
});
