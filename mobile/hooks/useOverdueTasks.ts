import { useMemo } from 'react';

import { getOverdueTasksFromRecords, useTaskStore } from '@/store/useTaskStore';

export const useOverdueTasks = () => {
  const tasks = useTaskStore((state) => state.tasks);

  return useMemo(() => getOverdueTasksFromRecords(tasks), [tasks]);
};
