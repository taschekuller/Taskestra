import { getOverdueTasksFromRecords, getTasksByDateRangeFromRecords } from '@/store/useTaskStore';
import type { TaskRecord } from '@/types/models';

const buildTask = (partial: Partial<TaskRecord> & Pick<TaskRecord, 'id' | 'title' | 'dueDateIso'>): TaskRecord => ({
  id: partial.id,
  title: partial.title,
  dueDateIso: partial.dueDateIso,
  isCompleted: partial.isCompleted ?? false,
  priority: partial.priority ?? 'medium',
  createdAtIso: partial.createdAtIso ?? '2026-03-01T08:00:00.000Z',
  description: partial.description,
});

describe('task selectors', () => {
  it('filters overdue tasks using current day boundary', () => {
    const now = new Date('2026-03-10T12:00:00.000Z');

    const records: TaskRecord[] = [
      buildTask({ id: '1', title: 'Past', dueDateIso: '2026-03-09T10:00:00.000Z' }),
      buildTask({ id: '2', title: 'Today', dueDateIso: '2026-03-10T09:00:00.000Z' }),
      buildTask({ id: '3', title: 'Done', dueDateIso: '2026-03-08T09:00:00.000Z', isCompleted: true }),
    ];

    const overdue = getOverdueTasksFromRecords(records, now);

    expect(overdue).toHaveLength(1);
    expect(overdue[0]?.id).toBe('1');
  });

  it('returns tasks inside date range', () => {
    const records: TaskRecord[] = [
      buildTask({ id: '1', title: 'Mon', dueDateIso: '2026-03-09T08:00:00.000Z' }),
      buildTask({ id: '2', title: 'Wed', dueDateIso: '2026-03-11T08:00:00.000Z' }),
      buildTask({ id: '3', title: 'Next week', dueDateIso: '2026-03-18T08:00:00.000Z' }),
    ];

    const tasks = getTasksByDateRangeFromRecords(
      records,
      new Date('2026-03-09T00:00:00.000Z'),
      new Date('2026-03-15T23:59:59.000Z'),
    );

    expect(tasks.map((task) => task.id)).toEqual(['1', '2']);
  });
});
