import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    BlurView: ({ children, ...props }: any) => React.createElement(View, props, children),
  };
});

jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    private readonly memory = new Map<string, string>();

    set(key: string, value: string) {
      this.memory.set(key, value);
    }

    getString(key: string) {
      return this.memory.get(key);
    }

    remove(key: string) {
      this.memory.delete(key);
    }
  }

  return {
    createMMKV: () => new MockMMKV(),
  };
});

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: {
    DATE: 'date',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
  },
  AndroidImportance: {
    HIGH: 4,
  },
  IosAuthorizationStatus: {
    PROVISIONAL: 2,
  },
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(async () => 'notif-1'),
  cancelScheduledNotificationAsync: jest.fn(async () => undefined),
  getAllScheduledNotificationsAsync: jest.fn(async () => []),
}));
