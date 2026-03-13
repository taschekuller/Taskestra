import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { cancelReminder, reconcileScheduledReminders, scheduleReminder } from '@/services/notifications';
import { storage } from '@/services/storage';
import type { Reminder, ReminderListKey, ReminderRecord, RepeatType } from '@/types/models';
import { toReminder } from '@/types/models';
import { createId } from '@/utils/id';

export interface AddReminderInput {
  title: string;
  notes?: string;
  dueDate: Date;
  listKey?: ReminderListKey;
  repeatType?: RepeatType;
}

export interface UpdateReminderInput {
  title?: string;
  notes?: string;
  dueDate?: Date;
  listKey?: ReminderListKey;
  repeatType?: RepeatType;
  isCompleted?: boolean;
}

interface ReminderStore {
  reminders: ReminderRecord[];
  addReminder: (input: AddReminderInput) => Promise<string>;
  toggleReminderCompletion: (id: string) => Promise<void>;
  updateReminder: (id: string, updates: UpdateReminderInput) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  getReminders: () => Reminder[];
  syncScheduledNotifications: () => Promise<void>;
}

const toRecord = (input: AddReminderInput, id: string): ReminderRecord => ({
  id,
  title: input.title.trim(),
  notes: input.notes,
  dueDateIso: input.dueDate.toISOString(),
  listKey: input.listKey === 'work' ? 'work' : 'others',
  repeatType: input.repeatType ?? 'none',
  isCompleted: false,
  createdAtIso: new Date().toISOString(),
});

export const useReminderStore = create<ReminderStore>()(
  persist(
    immer((set, get) => ({
      reminders: [],
      addReminder: async (input) => {
        const id = createId();
        const record = toRecord(input, id);
        const notificationId = await scheduleReminder(toReminder(record));

        if (notificationId) {
          record.notificationId = notificationId;
        }

        set((state) => {
          state.reminders.push(record);
        });

        return id;
      },
      toggleReminderCompletion: async (id) => {
        const found = get().reminders.find((item) => item.id === id);
        if (!found) {
          return;
        }

        let nextNotificationId = found.notificationId;
        const nextCompleted = !found.isCompleted;

        if (nextCompleted) {
          await cancelReminder(found.notificationId);
          nextNotificationId = undefined;
        } else {
          const scheduled = await scheduleReminder(toReminder({ ...found, isCompleted: false }));
          nextNotificationId = scheduled;
        }

        set((state) => {
          const target = state.reminders.find((item) => item.id === id);
          if (!target) {
            return;
          }

          target.isCompleted = nextCompleted;
          target.notificationId = nextNotificationId;
        });
      },
      updateReminder: async (id, updates) => {
        const found = get().reminders.find((item) => item.id === id);
        if (!found) {
          return;
        }

        await cancelReminder(found.notificationId);

        const updated: ReminderRecord = {
          ...found,
          title: updates.title ?? found.title,
          notes: updates.notes ?? found.notes,
          dueDateIso: updates.dueDate ? updates.dueDate.toISOString() : found.dueDateIso,
          listKey: updates.listKey
            ? (updates.listKey === 'work' ? 'work' : 'others')
            : (found.listKey === 'work' ? 'work' : 'others'),
          repeatType: updates.repeatType ?? found.repeatType,
          isCompleted: updates.isCompleted ?? found.isCompleted,
          notificationId: undefined,
        };

        if (!updated.isCompleted) {
          updated.notificationId = await scheduleReminder(toReminder(updated));
        }

        set((state) => {
          const index = state.reminders.findIndex((item) => item.id === id);
          if (index === -1) {
            return;
          }

          state.reminders[index] = updated;
        });
      },
      deleteReminder: async (id) => {
        const found = get().reminders.find((item) => item.id === id);
        await cancelReminder(found?.notificationId);

        set((state) => {
          state.reminders = state.reminders.filter((item) => item.id !== id);
        });
      },
      getReminders: () => get().reminders.map(toReminder),
      syncScheduledNotifications: async () => {
        const activeNotificationIds = get().reminders
          .filter((reminder) => !reminder.isCompleted)
          .map((reminder) => reminder.notificationId)
          .filter((id): id is string => Boolean(id));

        await reconcileScheduledReminders(activeNotificationIds);
      },
    })),
    {
      name: 'reminder-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
