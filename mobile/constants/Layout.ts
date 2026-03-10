export const Layout = {
  radius: {
    card: 20,
    md: 16,
    sm: 12,
    pill: 999,
    tabBar: 28,
    button: 16,
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  type: {
    display: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
    title1: { fontSize: 26, lineHeight: 32, fontWeight: '700' as const },
    title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
    title3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
    body: { fontSize: 16, lineHeight: 22, fontWeight: '500' as const },
    bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
    meta: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  },
  shadow: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
    },
    android: {
      elevation: 14,
    },
  },
};
