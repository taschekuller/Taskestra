import { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export const BottomActionBar = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  return <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
    backgroundColor: Colors.backgroundGradient[0],
    borderTopWidth: 1,
    borderTopColor: Colors.border.soft,
  },
});
