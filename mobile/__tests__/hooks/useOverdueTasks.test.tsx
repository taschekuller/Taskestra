import { act, renderHook } from '@testing-library/react-native';

import { useOverdueTasks } from '@/hooks/useOverdueTasks';
import { useTaskStore } from '@/store/useTaskStore';

describe('useOverdueTasks', () => {
  beforeEach(() => {
    act(() => {
      useTaskStore.setState((state) => ({
        ...state,
        tasks: [
          {
            id: '1',
            title: 'Past',
            dueDateIso: '2026-03-09T08:00:00.000Z',
            isCompleted: false,
            priority: 'medium',
            createdAtIso: '2026-03-01T08:00:00.000Z',
          },
          {
            id: '2',
            title: 'Future',
            dueDateIso: '2026-12-12T08:00:00.000Z',
            isCompleted: false,
            priority: 'medium',
            createdAtIso: '2026-03-01T08:00:00.000Z',
          },
        ],
      }));
    });
  });

  afterEach(() => {
    act(() => {
      useTaskStore.setState((state) => ({
        ...state,
        tasks: [],
      }));
    });
  });

  it('returns overdue records from the store', () => {
    const { result } = renderHook(() => useOverdueTasks());

    expect(result.current.length).toBe(1);
    expect(result.current[0]?.title).toBe('Past');
  });
});
