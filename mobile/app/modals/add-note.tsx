import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { NoteEditor } from '@/components/notes/NoteEditor';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';
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
  const [folderId, setFolderId] = useState(existingNote?.folderId ?? params.folderId);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(existingNote?.updatedAt ?? null);

  useEffect(() => {
    if (!existingNote) {
      return;
    }

    setNoteId(existingNote.id);
    setTitle(existingNote.title);
    setContent(existingNote.content);
    setFolderId(existingNote.folderId);
    setLastSavedAt(existingNote.updatedAt);
  }, [existingNote]);

  useEffect(() => {
    const hasContent = title.trim() || content.replace(/<[^>]+>/g, '').trim();
    if (!hasContent) {
      return;
    }

    const timeout = setTimeout(() => {
      if (noteId) {
        updateNote(noteId, { title, content, folderId });
        setLastSavedAt(new Date());
        return;
      }

      const createdId = addNote({ title, content, folderId });
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
            <GlassButton
              title="Others"
              onPress={() => setFolderId(undefined)}
              style={[styles.chip, !folderId && styles.selected]}
            />
            {folders.map((folder) => (
              <GlassButton
                key={folder.id}
                title={folder.name}
                onPress={() => setFolderId(folder.id)}
                style={[styles.chip, folderId === folder.id && styles.selected, { borderColor: folder.color }]}
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
    padding: 16,
    paddingBottom: 42,
    gap: 12,
    flexGrow: 1,
  },
  sectionTitle: {
    color: Colors.glassText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 90,
  },
  selected: {
    opacity: 1,
  },
  savedText: {
    color: Colors.glassSubtext,
    textAlign: 'right',
    fontSize: 12,
  },
});
