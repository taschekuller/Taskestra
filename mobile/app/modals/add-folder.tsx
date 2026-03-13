import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';
import { useNoteStore } from '@/store/useNoteStore';

const EMOJI_OPTIONS = [
  '📝', '📁', '📚', '💼', '🏃', '🎓', '💡', '📌', '✅', '🧠',
  '🎯', '📎', '🗂️', '🗒️', '📒', '💻', '🎵', '🛒', '✈️', '❤️',
] as const;

export default function AddFolderModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const folderRecords = useNoteStore((state) => state.folders);
  const addFolder = useNoteStore((state) => state.addFolder);
  const updateFolder = useNoteStore((state) => state.updateFolder);

  const existingFolder = useMemo(() => {
    if (!params.id) {
      return undefined;
    }

    return folderRecords.find((folder) => folder.id === params.id);
  }, [folderRecords, params.id]);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📝');

  useEffect(() => {
    if (!existingFolder) {
      return;
    }

    setName(existingFolder.name);
    setEmoji(existingFolder.emoji || '📝');
  }, [existingFolder]);

  const onSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Folder name is required.');
      return;
    }

    if (existingFolder) {
      updateFolder(existingFolder.id, { name, emoji });
    } else {
      addFolder({ name, emoji });
    }

    router.back();
  };

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <GlassInput label="Folder Name" value={name} onChangeText={setName} placeholder="e.g. Work" />

        <GlassCard>
          <Text style={styles.sectionTitle}>Choose Emoji</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((item) => {
              const selected = item === emoji;

              return (
                <Pressable
                  key={item}
                  style={[styles.emojiOption, selected && styles.emojiOptionSelected]}
                  onPress={() => setEmoji(item)}
                >
                  <Text style={styles.emojiText}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        <GlassButton title={existingFolder ? 'Update' : 'Save'} onPress={onSave} variant="primary" />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 42,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiOptionSelected: {
    borderColor: Colors.noteAccentStrong,
    backgroundColor: Colors.noteAccentSoft,
  },
  emojiText: {
    fontSize: 22,
  },
});
