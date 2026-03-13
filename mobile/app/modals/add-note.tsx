import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { NoteEditor } from '@/components/notes/NoteEditor';
import { Chip } from '@/components/ui/Chip';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
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
  const [folderId, setFolderId] = useState(existingNote?.folderId ?? params.folderId ?? 'others');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(existingNote?.updatedAt ?? null);

  useEffect(() => {
    if (!existingNote) {
      return;
    }

    setNoteId(existingNote.id);
    setTitle(existingNote.title);
    setContent(existingNote.content);
    setFolderId(existingNote.folderId ?? 'others');
    setLastSavedAt(existingNote.updatedAt);
  }, [existingNote]);

  useEffect(() => {
    const hasContent = title.trim() || content.replace(/<[^>]+>/g, '').trim();
    if (!hasContent) {
      return;
    }

    const timeout = setTimeout(() => {
      if (noteId) {
        updateNote(noteId, { title, content, folderId: folderId === 'others' ? undefined : folderId });
        setLastSavedAt(new Date());
        return;
      }

      const createdId = addNote({ title, content, folderId: folderId === 'others' ? undefined : folderId });
      setNoteId(createdId);
      setLastSavedAt(new Date());
    }, 500);

    return () => clearTimeout(timeout);
  }, [addNote, content, folderId, noteId, title, updateNote]);

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <NoteEditor title={title} content={content} onTitleChange={setTitle} onContentChange={setContent} />

        <GlassCard>
          <Text style={styles.sectionTitle}>Folder</Text>
          <View style={styles.chipWrap}>
            <Chip
              label="Others"
              selected={folderId === 'others'}
              onPress={() => setFolderId('others')}
            />
            {folders.map((folder) => (
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

        <GlassButton title="Close" onPress={() => router.back()} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.md,
    paddingBottom: Layout.spacing.lg,
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
});
