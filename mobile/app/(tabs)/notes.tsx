import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MOCK_NOTES, NOTE_CATEGORIES, type NoteCategory } from '@/constants/MockNotes';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('all');

  const latestNotes = useMemo(
    () => selectedCategory === 'all'
      ? MOCK_NOTES
      : MOCK_NOTES.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  );

  const openCreateNote = () => {
    router.push('/modals/add-note' as Href);
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>Notes</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {NOTE_CATEGORIES.map((category) => {
              const active = selectedCategory === category.key;

              return (
                <Pressable
                  key={category.key}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.latestSection}>
            <SectionHeader title="Latest Notes" count={latestNotes.length} />
            <View style={styles.latestGrid}>
              {latestNotes.map((item) => (
                <Pressable key={item.id} style={styles.latestGridItem} onPress={openCreateNote}>
                  <GlassCard style={styles.latestCard} contentStyle={[styles.latestCardContent, { backgroundColor: item.tint }]}>
                    <Text style={styles.latestCategory}>{item.category.toUpperCase()}</Text>
                    <Text numberOfLines={2} style={styles.latestTitle}>{item.title}</Text>
                    <Text style={styles.latestDate}>{item.dateLabel}</Text>
                  </GlassCard>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.fabStack, { bottom: insets.bottom + 74 }]}>
          <Pressable style={[styles.fab, styles.fabSecondary]} onPress={() => router.push('/modals/add-folder')}>
            <Ionicons name="folder-open-outline" size={18} color={Colors.glassText} />
          </Pressable>
          <Pressable style={[styles.fab, styles.fabPrimary]} onPress={openCreateNote}>
            <Ionicons name="add" size={24} color={Colors.noteAccentText} />
          </Pressable>
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
    ...Layout.type.title2,
    fontWeight: '800',
  },
  scrollContent: {
    paddingTop: Layout.spacing.sm,
    paddingBottom: 140,
    gap: Layout.spacing.sm,
  },
  categoryScroll: {
    gap: Layout.spacing.xs,
    paddingBottom: Layout.spacing.xs,
  },
  categoryChip: {
    minHeight: 34,
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    borderColor: Colors.noteAccentStrong,
    backgroundColor: 'rgba(244,217,107,0.15)',
  },
  categoryChipText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: Colors.text.primary,
  },
  latestSection: {
    marginBottom: Layout.spacing.xs,
  },
  latestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  latestGridItem: {
    width: '48%',
  },
  latestCard: {
    aspectRatio: 1,
  },
  latestCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  latestCategory: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  latestTitle: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '700',
    marginTop: Layout.spacing.xs,
  },
  latestDate: {
    color: Colors.text.tertiary,
    ...Layout.type.meta,
    marginTop: Layout.spacing.sm,
  },
  fabStack: {
    position: 'absolute',
    right: Layout.spacing.md,
    gap: Layout.spacing.xs,
    alignItems: 'center',
  },
  fab: {
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow.ios,
    ...Layout.shadow.android,
  },
  fabSecondary: {
    width: 42,
    height: 42,
    backgroundColor: Colors.surface.level2,
    borderColor: Colors.border.strong,
  },
  fabPrimary: {
    width: 56,
    height: 56,
    backgroundColor: Colors.noteAccent,
    borderColor: Colors.noteAccentStrong,
  },
});
