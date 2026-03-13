import { type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

export const BottomActionBar = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isLight = scheme === 'light';

  const content = (
    <View style={[styles.container, { paddingBottom: insets.bottom + 4 }]}>
      {children}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={56} tint={isLight ? 'light' : 'dark'} style={styles.blurWrapper}>
        {content}
      </BlurView>
    );
  }

  return <View style={styles.androidWrapper}>{content}</View>;
};

const styles = StyleSheet.create({
  blurWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border.soft,
    overflow: 'hidden',
  },
  androidWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border.soft,
    backgroundColor: 'rgba(11,18,32,0.84)',
  },
  container: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
  },
});
