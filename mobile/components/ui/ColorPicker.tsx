import { ScrollView, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

interface ColorPickerProps {
  selectedColor?: string;
  onSelect: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onSelect }: ColorPickerProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {Colors.projectColors.map((color) => {
        const isSelected = selectedColor === color;

        return (
          <Pressable
            key={color}
            onPress={() => onSelect(color)}
            style={[styles.swatch, { backgroundColor: color }, isSelected && styles.selected]}
          >
            {isSelected ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingVertical: 2,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  selected: {
    transform: [{ scale: 1.08 }],
  },
});
