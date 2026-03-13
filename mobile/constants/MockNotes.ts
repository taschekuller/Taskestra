export type NoteCategory = 'all' | 'work' | 'personal' | 'sport' | 'university';

export interface NoteCategoryItem {
  key: NoteCategory;
  label: string;
  accentColor?: string;
}

export interface MockNoteItem {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  category: Exclude<NoteCategory, 'all'>;
  tint: string;
}

export const NOTE_CATEGORIES: NoteCategoryItem[] = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work', accentColor: '#4ECDC4' },
  { key: 'personal', label: 'Personal', accentColor: '#FFB4A2' },
  { key: 'sport', label: 'Sport', accentColor: '#7CD992' },
  { key: 'university', label: 'University', accentColor: '#8AA8FF' },
];

export const MOCK_NOTES: MockNoteItem[] = [
  {
    id: 'mock-work-1',
    title: 'Sprint Planning',
    excerpt: 'Finalize Q2 roadmap items and assign clear ownership.',
    dateLabel: '11 Mar 2026',
    category: 'work',
    tint: 'rgba(78,205,196,0.18)',
  },
  {
    id: 'mock-personal-1',
    title: 'Weekend Plan',
    excerpt: 'Saturday morning run, bookstore, and evening meet-up.',
    dateLabel: '10 Mar 2026',
    category: 'personal',
    tint: 'rgba(255,180,162,0.2)',
  },
  {
    id: 'mock-sport-1',
    title: 'Gym Split',
    excerpt: 'Update Push/Pull/Legs split and optimize set volume.',
    dateLabel: '09 Mar 2026',
    category: 'sport',
    tint: 'rgba(124,217,146,0.18)',
  },
  {
    id: 'mock-uni-1',
    title: 'Data Structures',
    excerpt: 'Review heap and graph notes, then write a short summary.',
    dateLabel: '08 Mar 2026',
    category: 'university',
    tint: 'rgba(138,168,255,0.2)',
  },
  {
    id: 'mock-work-2',
    title: 'Design Review',
    excerpt: 'Review empty-state and CTA improvements in the new Notes flow.',
    dateLabel: '07 Mar 2026',
    category: 'work',
    tint: 'rgba(78,205,196,0.14)',
  },
  {
    id: 'mock-personal-2',
    title: 'Reading List',
    excerpt: 'Books to finish: Deep Work, Atomic Habits, Hooked.',
    dateLabel: '06 Mar 2026',
    category: 'personal',
    tint: 'rgba(255,180,162,0.14)',
  },
];
