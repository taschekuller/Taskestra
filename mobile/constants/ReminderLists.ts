import type { ReminderListKey } from '@/types/models';

export interface ReminderListMeta {
  key: 'work' | 'others';
  label: string;
  icon: string;
  tint: string;
  borderColor: string;
}

const DEFAULT_WORK_COLOR = '#9A7652';

const toTint = (hex: string, alpha = '2A') => `${hex}${alpha}`;

export const getReminderLists = (workColor?: string): ReminderListMeta[] => {
  const normalizedWork = workColor ?? DEFAULT_WORK_COLOR;

  return [
    {
      key: 'work',
      label: 'Work',
      icon: 'briefcase-outline',
      tint: toTint(normalizedWork, '2A'),
      borderColor: toTint(normalizedWork, 'A6'),
    },
    {
      key: 'others',
      label: 'Others',
      icon: 'ellipsis-horizontal-circle-outline',
      tint: 'rgba(148,163,184,0.22)',
      borderColor: 'rgba(148,163,184,0.56)',
    },
  ];
};

export const getReminderListMap = (workColor?: string): Record<ReminderListKey, ReminderListMeta> => {
  const [work, others] = getReminderLists(workColor);

  return {
    work,
    others,
    personal: others,
    sport: others,
    university: others,
  };
};
