import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { ColorPicker } from '@/components/ui/ColorPicker';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Colors } from '@/constants/Colors';
import { useNoteStore } from '@/store/useNoteStore';

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
  const [color, setColor] = useState<string>(Colors.projectColors[0]);

  useEffect(() => {
    if (!existingFolder) {
      return;
    }

    setName(existingFolder.name);
    setEmoji(existingFolder.emoji || '📝');
    setColor(existingFolder.color);
  }, [existingFolder]);

  const onSave = () => {
    if (!name.trim()) {
      Alert.alert('Eksik Alan', 'Klasör adı zorunludur.');
      return;
    }

    if (existingFolder) {
      updateFolder(existingFolder.id, { name, emoji, color });
    } else {
      addFolder({ name, emoji, color });
    }

    router.back();
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <GlassInput label="Klasör Adı" value={name} onChangeText={setName} placeholder="Örn: İş" />
        <GlassInput label="Emoji" value={emoji} onChangeText={setEmoji} placeholder="📁" maxLength={2} />

        <GlassCard>
          <Text style={styles.sectionTitle}>Renk</Text>
          <ColorPicker selectedColor={color} onSelect={setColor} />
        </GlassCard>

        <GlassButton title={existingFolder ? 'Güncelle' : 'Kaydet'} onPress={onSave} />
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
    color: Colors.glassText,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
});
