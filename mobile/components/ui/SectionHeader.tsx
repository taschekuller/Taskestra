import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface SectionHeaderProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = ({ title, count, actionLabel, onActionPress }: SectionHeaderProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {typeof count === 'number' ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: Layout.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.text.primary,
    ...Layout.type.title3,
  },
  badge: {
    minWidth: 24,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: Layout.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.strong,
    backgroundColor: Colors.surface.level2,
  },
  badgeText: {
    color: Colors.text.secondary,
    ...Layout.type.meta,
    fontWeight: '700',
  },
  action: {
    color: Colors.primary,
    ...Layout.type.caption,
    fontWeight: '700',
  },
});
