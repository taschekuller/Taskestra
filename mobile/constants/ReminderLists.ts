import type { ReminderListKey } from '@/types/models';
import { CATEGORY_CONFIGS } from '@/constants/Categories';

export interface ReminderListMeta {
  key: ReminderListKey;
  label: string;
  icon: string;
  tint: string;
  borderColor: string;
}

const toTint = (hex: string, alpha = '2A') => `${hex}${alpha}`;

export const getReminderLists = (workColor?: string): ReminderListMeta[] => {
  return CATEGORY_CONFIGS.map((category) => {
    if (category.key === 'work') {
      const normalizedWork = workColor ?? category.folderColor;
      return {
        key: category.key,
        label: category.label,
        icon: category.icon,
        tint: toTint(normalizedWork, '2A'),
        borderColor: toTint(normalizedWork, 'A6'),
      };
    }

    return {
      key: category.key,
      label: category.label,
      icon: category.icon,
      tint: category.tint,
      borderColor: category.borderColor,
    };
  });
};

export const getReminderListMap = (workColor?: string): Record<ReminderListKey, ReminderListMeta> => {
  const [work, personal, school, learning, others] = getReminderLists(workColor);

  return {
    work,
    personal,
    school,
    learning,
    others,
  };
};
