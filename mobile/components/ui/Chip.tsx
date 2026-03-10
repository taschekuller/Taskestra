import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const Chip = ({ label, selected, onPress, accentColor, style }: ChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        selected ? styles.selected : styles.unselected,
        selected && accentColor ? { borderColor: accentColor, backgroundColor: `${accentColor}1F` } : null,
        style,
      ]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 36,
    borderRadius: Layout.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselected: {
    borderColor: Colors.border.soft,
    backgroundColor: Colors.surface.level1,
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(79,140,255,0.18)',
  },
  text: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '600',
  },
  selectedText: {
    color: Colors.text.primary,
  },
});
