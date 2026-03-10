import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { Colors } from '@/constants/Colors';
import { storage } from '@/services/storage';
import type { Project, ProjectRecord } from '@/types/models';
import { toProject } from '@/types/models';
import { createId } from '@/utils/id';

interface AddProjectInput {
  name: string;
  color?: string;
  googleCalendarId?: string;
}

interface ProjectStore {
  projects: ProjectRecord[];
  addProject: (project: AddProjectInput) => string;
  updateProjectColor: (id: string, color: string) => void;
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'googleCalendarId'>>) => void;
  deleteProject: (id: string) => void;
  linkGoogleCalendar: (projectId: string, calendarId: string) => void;
  getProjects: () => Project[];
  getProjectById: (id?: string) => Project | undefined;
}

const getDefaultColor = (index: number) => Colors.projectColors[index % Colors.projectColors.length];

export const useProjectStore = create<ProjectStore>()(
  persist(
    immer((set, get) => ({
      projects: [],
      addProject: (project) => {
        const id = createId();

        set((state) => {
          state.projects.push({
            id,
            name: project.name.trim(),
            color: project.color ?? getDefaultColor(state.projects.length),
            googleCalendarId: project.googleCalendarId,
            createdAtIso: new Date().toISOString(),
          });
        });

        return id;
      },
      updateProjectColor: (id, color) => {
        set((state) => {
          const target = state.projects.find((project) => project.id === id);
          if (!target) {
            return;
          }

          target.color = color;
        });
      },
      updateProject: (id, updates) => {
        set((state) => {
          const target = state.projects.find((project) => project.id === id);
          if (!target) {
            return;
          }

          if (updates.name !== undefined) {
            target.name = updates.name;
          }

          if (updates.googleCalendarId !== undefined) {
            target.googleCalendarId = updates.googleCalendarId;
          }
        });
      },
      deleteProject: (id) => {
        set((state) => {
          state.projects = state.projects.filter((project) => project.id !== id);
        });
      },
      linkGoogleCalendar: (projectId, calendarId) => {
        set((state) => {
          const target = state.projects.find((project) => project.id === projectId);
          if (!target) {
            return;
          }

          target.googleCalendarId = calendarId;
        });
      },
      getProjects: () => get().projects.map(toProject),
      getProjectById: (id) => {
        if (!id) {
          return undefined;
        }

        const found = get().projects.find((project) => project.id === id);
        return found ? toProject(found) : undefined;
      },
    })),
    {
      name: 'project-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
