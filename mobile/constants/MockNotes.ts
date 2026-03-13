import type { ReminderListKey } from '@/types/models';

export type NoteCategory = ReminderListKey;

export interface MockNoteItem {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  category: NoteCategory;
  tint: string;
}

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
    id: 'mock-personal-1',
    title: 'Weekend Plan',
    excerpt: 'Saturday morning run, bookstore, and evening meet-up.',
    dateLabel: '10 Mar 2026',
    category: 'personal',
    tint: 'rgba(236,165,129,0.22)',
  },
  {
    id: 'mock-school-1',
    title: 'Data Structures',
    excerpt: 'Review graph traversal and queue problems before class.',
    dateLabel: '09 Mar 2026',
    category: 'school',
    tint: 'rgba(137,168,255,0.20)',
  },
  {
    id: 'mock-learning-1',
    title: 'React Native Patterns',
    excerpt: 'Summarize reusable layout and state patterns for MVP screens.',
    dateLabel: '08 Mar 2026',
    category: 'learning',
    tint: 'rgba(129,220,181,0.20)',
  },
  {
    id: 'mock-work-2',
    title: 'Design Review',
    excerpt: 'Review empty-state and CTA improvements in the new Notes flow.',
    dateLabel: '07 Mar 2026',
    category: 'work',
    tint: 'rgba(169,132,95,0.24)',
  },
  {
    id: 'mock-other-1',
    title: 'Reading List',
    excerpt: 'Books to finish: Deep Work, Atomic Habits, Hooked.',
    dateLabel: '06 Mar 2026',
    category: 'others',
    tint: 'rgba(107,114,128,0.18)',
  },
  {
    id: 'mock-personal-2',
    title: 'Health Check',
    excerpt: 'Schedule annual check-up and update personal routine notes.',
    dateLabel: '05 Mar 2026',
    category: 'personal',
    tint: 'rgba(236,165,129,0.16)',
  },
  {
    id: 'mock-learning-2',
    title: 'SwiftUI Notes',
    excerpt: 'Capture key takeaways from iOS design interaction videos.',
    dateLabel: '04 Mar 2026',
    category: 'learning',
    tint: 'rgba(129,220,181,0.16)',
  },
];
