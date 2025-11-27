export const colors = {
  primary: '#5E6AD2',
  primaryLight: '#D5DAFF',
  accent: '#FF9F80',
  success: '#48B27F',
  warning: '#F5A35C',
  danger: '#F16667',
  background: '#F7F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F1F7',
  textPrimary: '#1C1E26',
  textSecondary: '#5B6270',
  border: '#E0E3F0',
  categoryBlue: '#7BC7FF',
  categoryPink: '#FF92C2',
  categoryTeal: '#58D0C9',
  categoryYellow: '#FFE177',
} as const;

export const typography = {
  display: { fontSize: 44, lineHeight: 52, fontWeight: '700' as const },
  title: { fontSize: 32, lineHeight: 40, fontWeight: '600' as const },
  headline: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
  body: { fontSize: 18, lineHeight: 26, fontWeight: '400' as const },
  callout: { fontSize: 16, lineHeight: 22, fontWeight: '500' as const },
  footnote: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const shadows = {
  soft: {
    shadowColor: 'rgba(94, 106, 210, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  elevated: {
    shadowColor: 'rgba(25, 32, 72, 0.18)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  modal: {
    shadowColor: 'rgba(12, 16, 44, 0.24)',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 16,
  },
} as const;

export const motion = {
  spring: { stiffness: 160, damping: 20 },
  durationFast: 150,
  durationBase: 250,
  durationSlow: 400,
} as const;

export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;
