export type NoteCategory = 'all' | 'work' | 'others';

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
  { key: 'work', label: 'Work', accentColor: '#9A7652' },
  { key: 'others', label: 'Others', accentColor: '#6B7280' },
];

export const MOCK_NOTES: MockNoteItem[] = [
  {
    id: 'mock-work-1',
    title: 'Sprint Planning',
    excerpt: 'Finalize Q2 roadmap items and assign clear ownership.',
    dateLabel: '11 Mar 2026',
    category: 'work',
    tint: 'rgba(154,118,82,0.26)',
  },
  {
    id: 'mock-other-1',
    title: 'Weekend Plan',
    excerpt: 'Saturday morning run, bookstore, and evening meet-up.',
    dateLabel: '10 Mar 2026',
    category: 'others',
    tint: 'rgba(107,114,128,0.22)',
  },
  {
    id: 'mock-work-2',
    title: 'Gym Split',
    excerpt: 'Update Push/Pull/Legs split and optimize set volume.',
    dateLabel: '09 Mar 2026',
    category: 'work',
    tint: 'rgba(140,106,69,0.24)',
  },
  {
    id: 'mock-other-2',
    title: 'Data Structures',
    excerpt: 'Review heap and graph notes, then write a short summary.',
    dateLabel: '08 Mar 2026',
    category: 'others',
    tint: 'rgba(148,163,184,0.2)',
  },
  {
    id: 'mock-work-3',
    title: 'Design Review',
    excerpt: 'Review empty-state and CTA improvements in the new Notes flow.',
    dateLabel: '07 Mar 2026',
    category: 'work',
    tint: 'rgba(169,132,95,0.24)',
  },
  {
    id: 'mock-other-3',
    title: 'Reading List',
    excerpt: 'Books to finish: Deep Work, Atomic Habits, Hooked.',
    dateLabel: '06 Mar 2026',
    category: 'others',
    tint: 'rgba(107,114,128,0.18)',
  },
];
