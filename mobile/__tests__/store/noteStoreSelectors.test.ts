import { getFoldersWithCount } from '@/store/useNoteStore';
import type { NoteFolderRecord, NoteRecord } from '@/types/models';

describe('note selectors', () => {
  it('computes note counts per folder', () => {
    const folders: NoteFolderRecord[] = [
      { id: 'f1', name: 'Work', color: '#000', createdAtIso: '2026-03-10T10:00:00.000Z' },
      { id: 'f2', name: 'Ideas', color: '#111', createdAtIso: '2026-03-10T11:00:00.000Z' },
    ];

    const notes: NoteRecord[] = [
      {
        id: 'n1',
        title: 'A',
        content: 'x',
        folderId: 'f1',
        createdAtIso: '2026-03-10T10:00:00.000Z',
        updatedAtIso: '2026-03-10T10:00:00.000Z',
      },
      {
        id: 'n2',
        title: 'B',
        content: 'x',
        folderId: 'f1',
        createdAtIso: '2026-03-10T10:00:00.000Z',
        updatedAtIso: '2026-03-10T10:00:00.000Z',
      },
      {
        id: 'n3',
        title: 'C',
        content: 'x',
        folderId: 'f2',
        createdAtIso: '2026-03-10T10:00:00.000Z',
        updatedAtIso: '2026-03-10T10:00:00.000Z',
      },
    ];

    const result = getFoldersWithCount(folders, notes);

    expect(result.find((folder) => folder.id === 'f1')?.noteCount).toBe(2);
    expect(result.find((folder) => folder.id === 'f2')?.noteCount).toBe(1);
  });
});
