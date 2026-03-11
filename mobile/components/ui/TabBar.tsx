import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

type TabRouteName = 'index' | 'calendar' | 'reminders' | 'notes';

const TAB_META: Record<
  TabRouteName,
  {
    label: string;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: {
    label: 'Overview',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  calendar: {
    label: 'Calendar',
    activeIcon: 'calendar',
    inactiveIcon: 'calendar-outline',
  },
  reminders: {
    label: 'Reminders',
    activeIcon: 'alarm',
    inactiveIcon: 'alarm-outline',
  },
  notes: {
    label: 'Notes',
    activeIcon: 'document-text',
    inactiveIcon: 'document-text-outline',
  },
};

const TAB_HORIZONTAL_PADDING = 16;
const INDICATOR_EDGE_GAP = 5;

interface AnimatedTabButtonProps {
  routeKey: string;
  label: string;
  focused: boolean;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
  testID?: string;
  onPress: () => void;
}

const AnimatedTabButton = ({
  routeKey,
  label,
  focused,
  activeIcon,
  inactiveIcon,
  accessibilityLabel,
  testID,
  onPress,
}: AnimatedTabButtonProps) => {
  const scale = useSharedValue(focused ? 1.04 : 1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.04 : 1, {
      duration: 120,
      easing: Easing.out(Easing.quad),
    });
  }, [focused, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      key={routeKey}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabContent, iconStyle]}>
        <Ionicons name={focused ? activeIcon : inactiveIcon} size={20} color={Colors.glassText} />
        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

export const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isLight = scheme === 'light';
  const [barWidth, setBarWidth] = useState(0);

  const activeIndex = state.index;
  const routeCount = state.routes.length;
  const contentWidth = barWidth > 0 ? Math.max(0, barWidth - TAB_HORIZONTAL_PADDING * 2) : 0;
  const tabWidth = contentWidth > 0 ? contentWidth / routeCount : 0;
  const indicatorWidth = tabWidth > 0 ? Math.max(20, tabWidth - INDICATOR_EDGE_GAP * 2) : 0;

  const indicatorOffset = useSharedValue(0);

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    const minOffset = TAB_HORIZONTAL_PADDING + INDICATOR_EDGE_GAP;
    const maxOffset = TAB_HORIZONTAL_PADDING + Math.max(0, contentWidth - indicatorWidth - INDICATOR_EDGE_GAP);
    const targetOffset = TAB_HORIZONTAL_PADDING + activeIndex * tabWidth + INDICATOR_EDGE_GAP;
    const clampedOffset = Math.min(maxOffset, Math.max(minOffset, targetOffset));

    indicatorOffset.value = withTiming(clampedOffset, {
      duration: 190,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, contentWidth, indicatorOffset, indicatorWidth, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorOffset.value }],
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const bottomOffset = useMemo(
    () => Math.max(6, Platform.OS === 'ios' ? insets.bottom * 0.15 : 8),
    [insets.bottom],
  );

  const content = (
    <View style={styles.inner} onLayout={onLayout}>
      {tabWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              backgroundColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.28)',
              borderColor: isLight ? 'rgba(15,23,42,0.18)' : 'rgba(255,255,255,0.45)',
            },
            indicatorStyle,
          ]}
        />
      ) : null}

      {state.routes.map((route, index) => {
        const routeName = route.name as TabRouteName;
        const focused = activeIndex === index;
        const meta = TAB_META[routeName];
        const options = descriptors[route.key].options;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTabButton
            key={route.key}
            routeKey={route.key}
            label={meta.label}
            focused={focused}
            activeIcon={meta.activeIcon}
            inactiveIcon={meta.inactiveIcon}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
          />
        );
      })}
    </View>
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: bottomOffset }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={60} tint={isLight ? 'light' : 'dark'} style={styles.background}>
          {content}
        </BlurView>
      ) : (
        <View style={[styles.background, isLight ? styles.androidLightBackground : styles.androidDarkBackground]}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    left: 16,
    right: 16,
    position: 'absolute',
  },
  background: {
    borderRadius: Layout.radius.tabBar,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    ...Layout.shadow.ios,
    ...Layout.shadow.android,
  },
  androidLightBackground: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  androidDarkBackground: {
    backgroundColor: 'rgba(10,17,37,0.8)',
  },
  inner: {
    minHeight: 58,
    paddingHorizontal: TAB_HORIZONTAL_PADDING,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
    backgroundColor: Colors.glassBg,
  },
  indicator: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    borderRadius: 999,
    borderWidth: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    color: Colors.glassSubtext,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelFocused: {
    color: Colors.glassText,
  },
});
