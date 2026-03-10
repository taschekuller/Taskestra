import { Appearance } from 'react-native';

const DarkColors = {
  backgroundGradient: ['#0B1220', '#101A2E', '#15233D'],
  backgroundGradientLight: ['#FAFCFF', '#F4F8FF', '#EEF3FF'],

  surface: {
    level1: 'rgba(255,255,255,0.06)',
    level2: 'rgba(255,255,255,0.10)',
    level3: 'rgba(255,255,255,0.14)',
  },

  border: {
    soft: 'rgba(255,255,255,0.14)',
    strong: 'rgba(255,255,255,0.24)',
  },

  text: {
    primary: '#F4F7FF',
    secondary: '#B9C4DA',
    tertiary: '#8C98B0',
    inverse: '#0F172A',
  },

  glassBg: 'rgba(255,255,255,0.10)',
  glassBgStrong: 'rgba(255,255,255,0.16)',
  glassBorder: 'rgba(255,255,255,0.22)',
  glassText: '#F4F7FF',
  glassSubtext: '#B9C4DA',

  primary: '#4F8CFF',
  primaryPressed: '#3E78E6',
  noteAccent: '#F4D96B',
  noteAccentStrong: '#EBC94B',
  noteAccentSoft: 'rgba(244,217,107,0.24)',
  noteAccentText: '#2B2412',
  success: '#38C793',
  warning: '#FFB84D',
  danger: '#FF6B6B',
  info: '#67B2FF',

  projectColors: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9',
  ],
} as const;

const LightColors = {
  ...DarkColors,
  backgroundGradient: ['#FAFCFF', '#F4F8FF', '#EEF3FF'],
  backgroundGradientLight: ['#FAFCFF', '#F4F8FF', '#EEF3FF'],
  surface: {
    level1: 'rgba(255,255,255,0.72)',
    level2: 'rgba(255,255,255,0.88)',
    level3: 'rgba(255,255,255,0.96)',
  },
  border: {
    soft: 'rgba(15,23,42,0.10)',
    strong: 'rgba(15,23,42,0.20)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#334155',
    tertiary: '#64748B',
    inverse: '#F8FAFC',
  },
  glassBg: 'rgba(255,255,255,0.84)',
  glassBgStrong: 'rgba(255,255,255,0.95)',
  glassBorder: 'rgba(15,23,42,0.12)',
  glassText: '#0F172A',
  glassSubtext: '#334155',
  noteAccentSoft: 'rgba(244,217,107,0.52)',
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
} as const;

export const Colors = (Appearance.getColorScheme() === 'light' ? LightColors : DarkColors);

export type AppColors = typeof DarkColors;
