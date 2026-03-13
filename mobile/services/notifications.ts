import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import type { Reminder } from '@/types/models';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DEFAULT_CHANNEL_ID = 'default-reminders';

export const getReminderTrigger = (reminder: Reminder): Notifications.NotificationTriggerInput => {
  const dueDate = reminder.dueDate;

  switch (reminder.repeatType) {
    case 'daily':
      return {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: dueDate.getHours(),
        minute: dueDate.getMinutes(),
      };
    case 'weekly':
      return {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: dueDate.getDay() + 1,
        hour: dueDate.getHours(),
        minute: dueDate.getMinutes(),
      };
    case 'monthly':
      return {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: dueDate.getDate(),
        hour: dueDate.getHours(),
        minute: dueDate.getMinutes(),
      };
    case 'none':
    default:
      return {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dueDate.getTime() <= Date.now() + 5000 ? new Date(Date.now() + 15000) : dueDate,
      };
  }
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6C63FF',
    sound: 'default',
  });
};

export const requestPermission = async () => {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    await ensureAndroidChannel();
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  const granted = requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  if (granted) {
    await ensureAndroidChannel();
  }

  return granted;
};

export const scheduleReminder = async (reminder: Reminder) => {
  const granted = await requestPermission();
  if (!granted) {
    return undefined;
  }

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.notes || 'Your reminder is due.',
        sound: true,
      },
      trigger: getReminderTrigger(reminder),
    });

    return identifier;
  } catch (error) {
    console.warn('Failed to schedule reminder notification', error);
    return undefined;
  }
};

export const cancelReminder = async (notificationId?: string) => {
  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const reconcileScheduledReminders = async (notificationIds: string[]) => {
  const existing = await Notifications.getAllScheduledNotificationsAsync();
  const keepSet = new Set(notificationIds);

  const toCancel = existing
    .map((item) => item.identifier)
    .filter((identifier) => !keepSet.has(identifier));

  await Promise.all(toCancel.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
};

export const notificationService = {
  requestPermission,
  scheduleReminder,
  cancelReminder,
  reconcileScheduledReminders,
};

export type NotificationService = typeof notificationService;
