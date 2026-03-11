import { FlatList, StyleSheet, View } from 'react-native';

import { FolderCard } from '@/components/notes/FolderCard';
import type { NoteFolder } from '@/types/models';

interface FolderGridProps {
  folders: NoteFolder[];
  onOpenFolder: (folderId: string) => void;
  onFolderMenu: (folderId: string) => void;
}

export const FolderGrid = ({ folders, onOpenFolder, onFolderMenu }: FolderGridProps) => {
  return (
    <FlatList
      data={folders}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <FolderCard folder={item} onPress={onOpenFolder} onLongPress={onFolderMenu} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  column: {
    gap: 10,
  },
  item: {
    flex: 1,
  },
});
