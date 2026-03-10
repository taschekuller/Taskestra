import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  selected: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({ options, selected, onChange }: SegmentedControlProps<T>) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option.value === selected;

        return (
          <Pressable
            key={option.value}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface.level1,
    borderColor: Colors.border.soft,
    borderWidth: 1,
    borderRadius: Layout.radius.md,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionActive: {
    backgroundColor: Colors.surface.level3,
    borderWidth: 1,
    borderColor: Colors.border.strong,
  },
  optionText: {
    color: Colors.text.secondary,
    ...Layout.type.caption,
    fontWeight: '700',
  },
  optionTextActive: {
    color: Colors.text.primary,
  },
});
