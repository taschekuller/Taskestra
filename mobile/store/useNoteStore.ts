import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { storage } from '@/services/storage';
import type { Note, NoteFolder, NoteFolderRecord, NoteRecord } from '@/types/models';
import { toFolder, toNote } from '@/types/models';
import { createId } from '@/utils/id';

export interface AddFolderInput {
  name: string;
  color?: string;
  emoji?: string;
}

export interface UpdateFolderInput {
  name?: string;
  color?: string;
  emoji?: string;
}

export interface AddNoteInput {
  title: string;
  content: string;
  folderId?: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  folderId?: string;
}

interface NoteStore {
  folders: NoteFolderRecord[];
  notes: NoteRecord[];
  addFolder: (folder: AddFolderInput) => string;
  updateFolder: (id: string, updates: UpdateFolderInput) => void;
  deleteFolder: (id: string) => void;
  addNote: (note: AddNoteInput) => string;
  updateNote: (id: string, updates: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  getFolders: () => NoteFolder[];
  getNotes: () => Note[];
  getNotesByFolder: (folderId?: string) => Note[];
  getNoteById: (id?: string) => Note | undefined;
}

const FOLDER_BROWN_TONES = [
  '#8C6A45',
  '#9A7652',
  '#A9845F',
  '#B6906B',
  '#C39D79',
  '#D0A987',
];

const toFolderRecord = (input: AddFolderInput, index: number): NoteFolderRecord => ({
  id: createId(),
  name: input.name.trim(),
  color: input.color ?? FOLDER_BROWN_TONES[index % FOLDER_BROWN_TONES.length],
  emoji: input.emoji,
  createdAtIso: new Date().toISOString(),
});

const toNoteRecord = (input: AddNoteInput, id: string): NoteRecord => {
  const now = new Date().toISOString();

  return {
    id,
    title: input.title,
    content: input.content,
    folderId: input.folderId,
    createdAtIso: now,
    updatedAtIso: now,
  };
};

export const getFoldersWithCount = (folders: NoteFolderRecord[], notes: NoteRecord[]): NoteFolder[] => {
  return folders
    .map((folder) => {
      const noteCount = notes.filter((note) => note.folderId === folder.id).length;
      return toFolder(folder, noteCount);
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const useNoteStore = create<NoteStore>()(
  persist(
    immer((set, get) => ({
      folders: [],
      notes: [],
      addFolder: (folder) => {
        const record = toFolderRecord(folder, get().folders.length);

        set((state) => {
          state.folders.push(record);
        });

        return record.id;
      },
      updateFolder: (id, updates) => {
        set((state) => {
          const target = state.folders.find((folder) => folder.id === id);
          if (!target) {
            return;
          }

          if (updates.name !== undefined) {
            target.name = updates.name;
          }

          if (updates.color !== undefined) {
            target.color = updates.color;
          }

          if (updates.emoji !== undefined) {
            target.emoji = updates.emoji;
          }
        });
      },
      deleteFolder: (id) => {
        set((state) => {
          state.folders = state.folders.filter((folder) => folder.id !== id);
          state.notes = state.notes.map((note) => (
            note.folderId === id ? { ...note, folderId: undefined, updatedAtIso: new Date().toISOString() } : note
          ));
        });
      },
      addNote: (note) => {
        const id = createId();

        set((state) => {
          state.notes.push(toNoteRecord(note, id));
        });

        return id;
      },
      updateNote: (id, updates) => {
        set((state) => {
          const target = state.notes.find((note) => note.id === id);
          if (!target) {
            return;
          }

          if (updates.title !== undefined) {
            target.title = updates.title;
          }

          if (updates.content !== undefined) {
            target.content = updates.content;
          }

          if (updates.folderId !== undefined) {
            target.folderId = updates.folderId;
          }

          target.updatedAtIso = new Date().toISOString();
        });
      },
      deleteNote: (id) => {
        set((state) => {
          state.notes = state.notes.filter((note) => note.id !== id);
        });
      },
      getFolders: () => getFoldersWithCount(get().folders, get().notes),
      getNotes: () => get().notes.map(toNote),
      getNotesByFolder: (folderId) => {
        const notes = get().notes.map(toNote);

        if (!folderId) {
          return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        }

        return notes
          .filter((note) => note.folderId === folderId)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      },
      getNoteById: (id) => {
        if (!id) {
          return undefined;
        }

        const note = get().notes.find((item) => item.id === id);
        return note ? toNote(note) : undefined;
      },
    })),
    {
      name: 'note-store',
      storage: createJSONStorage(() => storage),
    },
  ),
);
