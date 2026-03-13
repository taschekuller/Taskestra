import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { LiquidFab } from '@/components/ui/LiquidFab';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MOCK_NOTES, type NoteCategory } from '@/constants/MockNotes';
import { getReminderLists } from '@/constants/ReminderLists';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useNoteStore } from '@/store/useNoteStore';

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('work');
  const folderRecords = useNoteStore((state) => state.folders);
  const workFolderColor = useMemo(
    () => folderRecords.find((folder) => folder.name.trim().toLowerCase() === 'work')?.color ?? '#9A7652',
    [folderRecords],
  );
  const categoryOptions = useMemo(() => getReminderLists(workFolderColor), [workFolderColor]);

  const latestNotes = useMemo(
    () => MOCK_NOTES.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  );
  const categoryTintMap = useMemo(
    () => Object.fromEntries(categoryOptions.map((item) => [item.key, item.tint])) as Record<NoteCategory, string>,
    [categoryOptions],
  );
  const categoryBorderMap = useMemo(
    () => Object.fromEntries(categoryOptions.map((item) => [item.key, item.borderColor])) as Record<NoteCategory, string>,
    [categoryOptions],
  );

  const openCreateNote = () => {
    router.push('/modals/add-note' as Href);
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <ScreenHeader title="Notes" onPressSettings={() => router.push('/modals/settings')} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoryOptions.map((category) => {
              const active = selectedCategory === category.key;

              return (
                <Pressable
                  key={category.key}
                  style={[
                    styles.categoryChip,
                    active
                      ? {
                          borderColor: categoryBorderMap[category.key],
                          backgroundColor: categoryTintMap[category.key],
                        }
                      : null,
                  ]}
                  onPress={() => setSelectedCategory(category.key as NoteCategory)}
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
                  <GlassCard
                    style={styles.latestCard}
                    contentStyle={[
                      styles.latestCardContent,
                      {
                        backgroundColor: categoryTintMap[item.category] ?? item.tint,
                      },
                    ]}
                  >
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
          <LiquidFab
            size={44}
            icon={<Ionicons name="folder-open-outline" size={18} color={Colors.glassText} />}
            onPress={() => router.push('/modals/add-folder')}
          />
          <LiquidFab
            tone="accent"
            size={58}
            icon={<Ionicons name="add" size={26} color={Colors.noteAccentStrong} />}
            onPress={openCreateNote}
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
});
