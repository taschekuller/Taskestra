import type { ReminderListKey } from '@/types/models';

export interface CategoryConfig {
  key: ReminderListKey;
  label: string;
  icon: string;
  folderColor: string;
  folderEmoji: string;
  tint: string;
  borderColor: string;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'work',
    label: 'Work',
    icon: 'briefcase-outline',
    folderColor: '#9A7652',
    folderEmoji: '💼',
    tint: '#9A76522A',
    borderColor: '#9A7652A6',
  },
  {
    key: 'personal',
    label: 'Personal',
    icon: 'person-outline',
    folderColor: '#ECA581',
    folderEmoji: '🙂',
    tint: 'rgba(236, 165, 129, 0.24)',
    borderColor: 'rgba(236, 165, 129, 0.72)',
  },
  {
    key: 'school',
    label: 'School',
    icon: 'school-outline',
    folderColor: '#89A8FF',
    folderEmoji: '🎓',
    tint: 'rgba(137, 168, 255, 0.22)',
    borderColor: 'rgba(137, 168, 255, 0.68)',
  },
  {
    key: 'learning',
    label: 'Learning',
    icon: 'book-outline',
    folderColor: '#81DCB5',
    folderEmoji: '📚',
    tint: 'rgba(129, 220, 181, 0.24)',
    borderColor: 'rgba(129, 220, 181, 0.72)',
  },
  {
    key: 'others',
    label: 'Others',
    icon: 'ellipsis-horizontal-circle-outline',
    folderColor: '#94A3B8',
    folderEmoji: '🗂️',
    tint: 'rgba(148,163,184,0.22)',
    borderColor: 'rgba(148,163,184,0.56)',
  },
];
