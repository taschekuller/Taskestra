import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventCard } from '@/components/calendar/EventCard';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useCalendarStore } from '@/store/useCalendarStore';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  const [referenceDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMode = useCalendarStore((state) => state.selectedMode);
  const setSelectedMode = useCalendarStore((state) => state.setSelectedMode);

  const { accessToken, isConnected, isLoading: authLoading, signIn, signOut } = useGoogleAuth();
  const { events, isLoading: eventsLoading } = useCalendarEvents(accessToken);

  const weekDays = useMemo(
    () => eachDayOfInterval({
      start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
      end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
    }),
    [selectedDate],
  );

  const selectedDayEvents = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    return events
      .filter((event) => event.startDate >= start && event.startDate <= end)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events, selectedDate]);

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}> 
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Gününü seç, event akışını saat bazında yönet.</Text>

        <GlassCard style={styles.toggleCard}>
          <SegmentedControl
            options={[
              { label: 'Haftalık', value: 'week' },
              { label: 'Aylık', value: 'month' },
            ]}
            selected={selectedMode}
            onChange={(value) => {
              if (value !== selectedMode) {
                setSelectedMode(value);
              }
            }}
          />
          <Text style={styles.monthTitle}>{format(referenceDate, 'MMMM yyyy', { locale: tr })}</Text>
        </GlassCard>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
          {weekDays.map((day) => {
            const active = isSameDay(day, selectedDate);

            return (
              <Pressable
                key={day.toISOString()}
                style={[styles.dayPill, active && styles.dayPillActive]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={[styles.dayPillLabel, active && styles.dayPillLabelActive]}>
                  {format(day, 'EE', { locale: tr })}
                </Text>
                <Text style={[styles.dayPillDate, active && styles.dayPillLabelActive]}>
                  {format(day, 'd')}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {selectedMode === 'week' ? <WeekView referenceDate={referenceDate} /> : <MonthView referenceDate={referenceDate} />}

        <GlassCard style={styles.integrationCard}>
          <Text style={styles.integrationTitle}>Google Calendar</Text>
          <Text style={styles.integrationText}>
            Takvimleri bağlayıp eventleri proje renkleriyle görüntüleyebilirsin.
          </Text>

          <GlassButton
            title={isConnected ? 'Bağlantıyı Kaldır' : 'Google ile Bağla'}
            onPress={() => {
              if (isConnected) {
                void signOut();
                return;
              }

              void signIn();
            }}
            disabled={authLoading}
            variant="primary"
          />
        </GlassCard>

        <ScrollView contentContainerStyle={[styles.eventsContainer, { paddingBottom: 140 }]}>
          <SectionHeader
            title={format(selectedDate, 'd MMMM, EEEE', { locale: tr })}
            count={selectedDayEvents.length}
          />

          {eventsLoading ? <Text style={styles.mutedText}>Eventler yükleniyor...</Text> : null}

          {!eventsLoading && selectedDayEvents.length === 0 ? (
            <EmptyStateCard
              title="Bu gün için event yok"
              description="Takviminde yeni etkinlik görünmüyor. Farklı bir gün seçebilir veya Google hesabını bağlayabilirsin."
              ctaLabel={!isConnected ? 'Google ile Bağlan' : undefined}
              onCtaPress={!isConnected ? () => { void signIn(); } : undefined}
              iconName="calendar-clear-outline"
            />
          ) : null}

          {selectedDayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title1,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginBottom: Layout.spacing.xs,
  },
  toggleCard: {
    marginTop: Layout.spacing.xxs,
  },
  monthTitle: {
    marginTop: Layout.spacing.sm,
    color: Colors.text.secondary,
    ...Layout.type.caption,
    textTransform: 'capitalize',
  },
  daysRow: {
    gap: Layout.spacing.xs,
    paddingBottom: Layout.spacing.xs,
  },
  dayPill: {
    borderWidth: 1,
    borderColor: Colors.border.soft,
    borderRadius: Layout.radius.md,
    minWidth: 58,
    paddingVertical: Layout.spacing.xs,
    alignItems: 'center',
    backgroundColor: Colors.surface.level1,
  },
  dayPillActive: {
    backgroundColor: 'rgba(79,140,255,0.2)',
    borderColor: Colors.primary,
  },
  dayPillLabel: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    textTransform: 'capitalize',
  },
  dayPillDate: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
  },
  dayPillLabelActive: {
    color: Colors.text.primary,
  },
  integrationCard: {
    marginTop: Layout.spacing.xxs,
  },
  integrationTitle: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '700',
    marginBottom: Layout.spacing.xs,
  },
  integrationText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginBottom: Layout.spacing.sm,
  },
  eventsContainer: {
    paddingTop: Layout.spacing.xs,
  },
  mutedText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    marginBottom: Layout.spacing.sm,
  },
});
