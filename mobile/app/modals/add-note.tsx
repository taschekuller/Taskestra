import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NoteEditor } from '@/components/notes/NoteEditor';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { Chip } from '@/components/ui/Chip';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { CATEGORY_CONFIGS } from '@/constants/Categories';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useNoteStore } from '@/store/useNoteStore';
import { toNote } from '@/types/models';

export default function AddNoteModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ noteId?: string; folderId?: string }>();

  const noteRecords = useNoteStore((state) => state.notes);
  const folders = useNoteStore((state) => state.folders);
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);

  const existingNote = useMemo(() => {
    if (!params.noteId) {
      return undefined;
    }

    const found = noteRecords.find((note) => note.id === params.noteId);
    return found ? toNote(found) : undefined;
  }, [noteRecords, params.noteId]);

  const [noteId, setNoteId] = useState<string | undefined>(existingNote?.id);
  const [title, setTitle] = useState(existingNote?.title ?? '');
  const [content, setContent] = useState(existingNote?.content ?? '');
  const [folderId, setFolderId] = useState<string | undefined>(existingNote?.folderId ?? params.folderId);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(existingNote?.updatedAt ?? null);

  const orderedFolders = useMemo(() => {
    const orderMap = new Map(CATEGORY_CONFIGS.map((category, index) => [category.label.toLowerCase(), index]));
    return [...folders].sort((a, b) => {
      const aOrder = orderMap.get(a.name.trim().toLowerCase());
      const bOrder = orderMap.get(b.name.trim().toLowerCase());

      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }

      if (aOrder !== undefined) {
        return -1;
      }

      if (bOrder !== undefined) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });
  }, [folders]);

  const othersFolderId = useMemo(
    () => orderedFolders.find((folder) => folder.name.trim().toLowerCase() === 'others')?.id,
    [orderedFolders],
  );

  useEffect(() => {
    if (!existingNote) {
      return;
    }

    setNoteId(existingNote.id);
    setTitle(existingNote.title);
    setContent(existingNote.content);
    setFolderId(existingNote.folderId ?? othersFolderId);
    setLastSavedAt(existingNote.updatedAt);
  }, [existingNote, othersFolderId]);

  useEffect(() => {
    if (!folderId && othersFolderId) {
      setFolderId(othersFolderId);
    }
  }, [folderId, othersFolderId]);

  const persistDraft = useCallback(() => {
    const normalizedFolderId = folderId ?? othersFolderId;

    if (noteId) {
      updateNote(noteId, { title, content, folderId: normalizedFolderId });
      setLastSavedAt(new Date());
      return noteId;
    }

    const createdId = addNote({ title, content, folderId: normalizedFolderId });
    setNoteId(createdId);
    setLastSavedAt(new Date());
    return createdId;
  }, [addNote, content, folderId, noteId, othersFolderId, title, updateNote]);

  useEffect(() => {
    const hasContent = title.trim() || content.replace(/<[^>]+>/g, '').trim();
    if (!hasContent) {
      return;
    }

    const timeout = setTimeout(() => {
      persistDraft();
    }, 500);

    return () => clearTimeout(timeout);
  }, [content, persistDraft, title]);

  const onSave = () => {
    const hasContent = title.trim() || content.replace(/<[^>]+>/g, '').trim();
    if (!hasContent) {
      Alert.alert('Empty Note', 'Please add a title or note content before saving.');
      return;
    }

    persistDraft();
    router.back();
  };

  return (
    <GradientBackground>
      <View style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <NoteEditor title={title} content={content} onTitleChange={setTitle} onContentChange={setContent} />

          <GlassCard>
            <Text style={styles.sectionTitle}>Folder</Text>
            <View style={styles.chipWrap}>
              {orderedFolders.map((folder) => (
                <Chip
                  key={folder.id}
                  label={folder.name}
                  selected={folderId === folder.id}
                  accentColor={folder.color}
                  onPress={() => setFolderId(folder.id)}
                />
              ))}
            </View>
          </GlassCard>

          {lastSavedAt ? <Text style={styles.savedText}>Auto-saved: {lastSavedAt.toLocaleTimeString('en-US')}</Text> : null}
        </ScrollView>

        <BottomActionBar>
          <View style={styles.actionRow}>
            <GlassButton title="Cancel" onPress={() => router.back()} variant="secondary" style={styles.actionBtn} />
            <GlassButton title="Save" onPress={onSave} variant="primary" style={styles.actionBtn} />
          </View>
        </BottomActionBar>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: Layout.spacing.md,
    paddingBottom: 150,
    gap: Layout.spacing.sm,
  },
  sectionTitle: {
    color: Colors.glassText,
    ...Layout.type.caption,
    fontWeight: '700',
    marginBottom: Layout.spacing.xs,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  savedText: {
    color: Colors.glassSubtext,
    textAlign: 'right',
    ...Layout.type.meta,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
});
