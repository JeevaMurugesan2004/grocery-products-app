import { Platform } from 'react-native';

export const COLORS = {
  // Figma Design System Reference Colors
  background: '#FFF9E9',       // Soft warm cream
  card: '#F5F5D9',             // Soft pale olive/cream card bg
  cardLight: '#FCFCEE',
  primary: '#D8C51D',          // Main button warm golden yellow
  selected: '#FFE600',         // Selected category vibrant yellow
  selectedBadge: '#FFDD00',
  text: '#202020',             // Deep charcoal/black text
  secondaryText: '#777568',    // Secondary muted gray/olive
  lightText: '#9C9A8E',
  white: '#FFFFFF',
  border: '#E8E2CB',
  borderLight: '#F2EDE0',
  danger: '#E04848',
  dangerLight: '#FDEAEA',
  success: '#4A8A3A',
  successLight: '#EBF5E7',
  star: '#FFAA00',
  drawerHeader: '#EFECCF',
  overlay: 'rgba(32, 32, 32, 0.45)',
  shadow: '#202020',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  full: 9999,
} as const;

export const FONTS = {
  regular: Platform.select({ ios: 'System', default: 'sans-serif' }),
  medium: Platform.select({ ios: 'System', default: 'sans-serif-medium' }),
  bold: Platform.select({ ios: 'System', default: 'sans-serif-bold' }),
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 7,
  },
};

export type ColorTheme = {
  text: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  textSecondary: string;
};

// Backwards-compatible Colors and ThemeColor export
export const Colors: Record<'light' | 'dark', ColorTheme> = {
  light: {
    text: COLORS.text,
    background: COLORS.background,
    backgroundElement: COLORS.card,
    backgroundSelected: COLORS.selected,
    textSecondary: COLORS.secondaryText,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A18',
    backgroundElement: '#2B2B26',
    backgroundSelected: '#4A4A38',
    textSecondary: '#A8A699',
  },
};

export type ThemeColor = keyof ColorTheme;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
