import { type Href, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BentoBoard } from '@/components/notes/BentoBoard';
import { FolderGrid } from '@/components/notes/FolderGrid';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { getFoldersWithCount, useNoteStore } from '@/store/useNoteStore';
import { toNote } from '@/types/models';

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const folderRecords = useNoteStore((state) => state.folders);
  const noteRecords = useNoteStore((state) => state.notes);
  const deleteFolder = useNoteStore((state) => state.deleteFolder);
  const deleteNote = useNoteStore((state) => state.deleteNote);

  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();

  const folders = useMemo(() => getFoldersWithCount(folderRecords, noteRecords), [folderRecords, noteRecords]);
  const notes = useMemo(() => noteRecords.map(toNote), [noteRecords]);

  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId);
  const latestNote = notes[0];

  const visibleNotes = useMemo(() => {
    if (!selectedFolderId) {
      return notes
        .filter((note) => !note.folderId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    return notes
      .filter((note) => note.folderId === selectedFolderId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [notes, selectedFolderId]);

  const openCreateNote = () => {
    const path = selectedFolderId ? `/modals/add-note?folderId=${selectedFolderId}` : '/modals/add-note';
    router.push(path as Href);
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}> 
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {selectedFolderId ? (
              <Pressable onPress={() => setSelectedFolderId(undefined)} style={styles.backButton}>
                <Ionicons name="chevron-back" size={20} color={Colors.glassText} />
              </Pressable>
            ) : null}
            <Text style={styles.title}>{selectedFolder?.name || 'Notlar'}</Text>
          </View>

          <Pressable onPress={() => router.push('/modals/add-folder')}>
            <Ionicons name="add-circle" size={30} color={Colors.glassText} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Notlarını klasörle, pinle ve hızlıca düzenle.</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {!selectedFolderId ? (
            <View style={styles.bentoSection}>
              <BentoBoard
                noteCount={notes.length}
                folderCount={folders.length}
                latestNoteTitle={latestNote?.title}
                onCreateNote={openCreateNote}
                onOpenFolders={() => setSelectedFolderId(undefined)}
              />
            </View>
          ) : null}

          {!selectedFolderId ? (
            <View style={styles.notesHeader}>
              <SectionHeader title="Klasörler" count={folders.length} />
              <Pressable onPress={() => router.push('/modals/add-folder')}>
                <Ionicons name="add" size={22} color={Colors.glassText} />
              </Pressable>
            </View>
          ) : null}

          {!selectedFolderId ? (
            <FolderGrid
              folders={folders}
              onOpenFolder={setSelectedFolderId}
              onFolderMenu={(folderId) => {
                Alert.alert('Klasör', 'Ne yapmak istersiniz?', [
                  {
                    text: 'Düzenle',
                    onPress: () => router.push(`/modals/add-folder?id=${folderId}`),
                  },
                  {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => deleteFolder(folderId),
                  },
                  { text: 'İptal', style: 'cancel' },
                ]);
              }}
            />
          ) : null}

          <View style={styles.notesHeader}>
            <SectionHeader title="Notlar" count={visibleNotes.length} />
            <Pressable onPress={openCreateNote}>
              <Ionicons name="add" size={24} color={Colors.glassText} />
            </Pressable>
          </View>

          {visibleNotes.length === 0 ? (
            <GlassCard>
              <Text style={styles.emptyText}>Henüz not bulunmuyor.</Text>
            </GlassCard>
          ) : (
            visibleNotes.map((note) => (
              <Pressable key={note.id} onPress={() => router.push(`/modals/add-note?noteId=${note.id}`)}>
                <GlassCard style={styles.noteCard}>
                  <Text style={styles.noteTitle}>{note.title || 'Başlıksız Not'}</Text>
                  <Text style={styles.noteDate}>
                    Güncellendi: {format(note.updatedAt, 'd MMM yyyy HH:mm', { locale: tr })}
                  </Text>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert('Not silinsin mi?', note.title || 'Başlıksız not', [
                        { text: 'İptal', style: 'cancel' },
                        {
                          text: 'Sil',
                          style: 'destructive',
                          onPress: () => deleteNote(note.id),
                        },
                      ]);
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.glassSubtext} />
                  </Pressable>
                </GlassCard>
              </Pressable>
            ))
          )}
        </ScrollView>

        <BottomActionBar>
          <GlassButton title="Yeni Not" onPress={openCreateNote} variant="primary" />
        </BottomActionBar>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title1,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: Layout.spacing.xxs,
    color: Colors.text.secondary,
    ...Layout.type.caption,
  },
  scrollContent: {
    paddingTop: Layout.spacing.md,
    paddingBottom: 180,
    gap: Layout.spacing.sm,
  },
  bentoSection: {
    marginBottom: Layout.spacing.xxs,
  },
  notesHeader: {
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
  },
  noteCard: {
    marginBottom: Layout.spacing.xs,
    position: 'relative',
  },
  noteTitle: {
    color: Colors.text.primary,
    ...Layout.type.bodyStrong,
    fontWeight: '700',
    marginBottom: Layout.spacing.xxs,
    paddingRight: 24,
  },
  noteDate: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
