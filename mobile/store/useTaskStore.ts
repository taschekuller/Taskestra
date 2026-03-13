import { endOfDay, isAfter, isBefore, isWithinInterval, startOfDay } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { storage } from '@/services/storage';
import type { Priority, Task, TaskRecord } from '@/types/models';
import { toTask } from '@/types/models';
import { createId } from '@/utils/id';

export interface AddTaskInput {
  title: string;
  description?: string;
  dueDate: Date;
  priority?: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  isCompleted?: boolean;
  priority?: Priority;
}

export const getOverdueTasksFromRecords = (records: TaskRecord[], now: Date = new Date()): Task[] => {
  const todayStart = startOfDay(now);

  return records
    .map(toTask)
    .filter((task) => !task.isCompleted && isBefore(task.dueDate, todayStart))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

export const getTasksByDateRangeFromRecords = (
  records: TaskRecord[],
  start: Date,
  end: Date,
): Task[] => {
  const startDate = startOfDay(start);
  const endDate = endOfDay(end);

  return records
    .map(toTask)
    .filter((task) => {
      const inInterval = isWithinInterval(task.dueDate, { start: startDate, end: endDate });
      return inInterval || isAfter(task.dueDate, startDate) && isBefore(task.dueDate, endDate);
    })
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

interface TaskStore {
  tasks: TaskRecord[];
  addTask: (task: AddTaskInput) => string;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  getTasks: () => Task[];
  getOverdueTasks: (now?: Date) => Task[];
  getTasksByDateRange: (start: Date, end: Date) => Task[];
}

const toRecord = (task: AddTaskInput, id: string): TaskRecord => ({
  id,
  title: task.title.trim(),
  description: task.description,
  dueDateIso: task.dueDate.toISOString(),
  isCompleted: false,
  priority: task.priority ?? 'medium',
  createdAtIso: new Date().toISOString(),
});

export const useTaskStore = create<TaskStore>()(
  persist(
    immer((set, get) => ({
      tasks: [],
      addTask: (task) => {
        const id = createId();

        set((state) => {
          state.tasks.push(toRecord(task, id));
        });

        return id;
      },
      toggleTask: (id) => {
        set((state) => {
          const target = state.tasks.find((task) => task.id === id);
          if (!target) {
            return;
          }

          target.isCompleted = !target.isCompleted;
        });
      },
      updateTask: (id, updates) => {
        set((state) => {
          const target = state.tasks.find((task) => task.id === id);
          if (!target) {
            return;
          }

          if (updates.title !== undefined) {
            target.title = updates.title;
          }

          if (updates.description !== undefined) {
            target.description = updates.description;
          }

          if (updates.dueDate !== undefined) {
            target.dueDateIso = updates.dueDate.toISOString();
          }

          if (updates.isCompleted !== undefined) {
            target.isCompleted = updates.isCompleted;
          }

          if (updates.priority !== undefined) {
            target.priority = updates.priority;
          }
        });
      },
      deleteTask: (id) => {
        set((state) => {
          state.tasks = state.tasks.filter((task) => task.id !== id);
        });
      },
      getTasks: () => get().tasks.map(toTask),
      getOverdueTasks: (now = new Date()) => getOverdueTasksFromRecords(get().tasks, now),
      getTasksByDateRange: (start, end) => getTasksByDateRangeFromRecords(get().tasks, start, end),
    })),
    {
      name: 'task-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
