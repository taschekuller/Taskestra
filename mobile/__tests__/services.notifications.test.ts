import { getReminderTrigger } from '@/services/notifications';
import type { Reminder } from '@/types/models';

const baseReminder: Reminder = {
  id: '1',
  title: 'Test',
  dueDate: new Date('2026-03-10T09:30:00.000Z'),
  listKey: 'others',
  repeatType: 'none',
  isCompleted: false,
  createdAt: new Date('2026-03-10T09:00:00.000Z'),
};

describe('notification trigger', () => {
  it('returns date trigger for one-time reminders', () => {
    const trigger = getReminderTrigger(baseReminder);
    expect(trigger).toMatchObject({ type: 'date' });
  });

  it('returns repeat trigger for daily reminders', () => {
    const trigger = getReminderTrigger({ ...baseReminder, repeatType: 'daily' });
    expect(trigger).toMatchObject({
      type: 'daily',
      hour: baseReminder.dueDate.getHours(),
      minute: baseReminder.dueDate.getMinutes(),
    });
  });
});
