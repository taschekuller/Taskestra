import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/Colors';
import type { NoteFolder } from '@/types/models';

interface FolderCardProps {
  folder: NoteFolder;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
}

export const FolderCard = ({ folder, onPress, onLongPress }: FolderCardProps) => {
  return (
    <Pressable onPress={() => onPress(folder.id)} onLongPress={() => onLongPress(folder.id)}>
      <GlassCard style={styles.card} contentStyle={styles.content}>
        <LinearGradient
          colors={[folder.color, `${folder.color}88`]}
          style={styles.top}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.bottom}>
          <Text style={styles.emoji}>{folder.emoji || '📝'}</Text>
          <Text style={styles.name} numberOfLines={1}>{folder.name}</Text>
          <Text style={styles.count}>{folder.noteCount} not</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  content: {
    padding: 0,
  },
  top: {
    height: 70,
  },
  bottom: {
    padding: 12,
    gap: 4,
  },
  emoji: {
    fontSize: 22,
  },
  name: {
    color: Colors.glassText,
    fontWeight: '700',
    fontSize: 14,
  },
  count: {
    color: Colors.glassSubtext,
    fontSize: 12,
  },
});
