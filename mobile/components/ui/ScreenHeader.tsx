import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ScreenHeaderProps {
  title: string;
  onPressSettings: () => void;
}

export const ScreenHeader = ({ title, onPressSettings }: ScreenHeaderProps) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>

      <Pressable style={styles.settingsButton} onPress={onPressSettings}>
        <Ionicons name="settings-outline" size={18} color={Colors.text.primary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title1,
    fontWeight: '800',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
