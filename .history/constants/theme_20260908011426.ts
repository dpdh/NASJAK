import type { ColorScheme } from '../types';

export type { ColorScheme };

export interface ColorAccent {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  surface: string;
  background: string;
  tabBarActive: string;
  overlay: string;
  shadow: string;
  // dark mode overrides
  darkSurface: string;
  darkBackground: string;
  darkCard: string;
  darkBorder: string;
  darkOverlay: string;
}

export const COLOR_SCHEMES: Record<ColorScheme, ColorAccent & { label: string; icon: string }> = {
  mist: {
    label: 'Mist Calm',
    icon: 'cloud-outline',
    primary: '#739AA6',
    primaryLight: '#BFD4D7',
    primaryDark: '#557984',
    surface: '#E8F0F0',
    background: '#F5F8F8',
    tabBarActive: '#739AA6',
    overlay: 'rgba(115, 154, 166, 0.07)',
    shadow: '#739AA6',
    darkSurface: '#27383D',
    darkBackground: '#172326',
    darkCard: '#304348',
    darkBorder: '#40585D',
    darkOverlay: 'rgba(115, 154, 166, 0.14)',
  },
  ocean: {
    label: 'Ocean Blue',
    icon: 'water',
    primary: '#00B4D8',
    primaryLight: '#90E0EF',
    primaryDark: '#0077B6',
    surface: '#CAF0F8',
    background: '#F0FAFF',
    tabBarActive: '#00B4D8',
    overlay: 'rgba(0, 180, 216, 0.08)',
    shadow: '#00B4D8',
    darkSurface: '#112240',
    darkBackground: '#0A1628',
    darkCard: '#162B4D',
    darkBorder: '#1E3A5F',
    darkOverlay: 'rgba(0, 180, 216, 0.15)',
  },
  emerald: {
    label: 'Emerald Green',
    icon: 'leaf',
    primary: '#10B981',
    primaryLight: '#6EE7B7',
    primaryDark: '#059669',
    surface: '#D1FAE5',
    background: '#ECFDF5',
    tabBarActive: '#10B981',
    overlay: 'rgba(16, 185, 129, 0.08)',
    shadow: '#10B981',
    darkSurface: '#0F2E1F',
    darkBackground: '#071A12',
    darkCard: '#133D27',
    darkBorder: '#1A5235',
    darkOverlay: 'rgba(16, 185, 129, 0.15)',
  },
  royal: {
    label: 'Royal Purple',
    icon: 'diamond',
    primary: '#7C3AED',
    primaryLight: '#C4B5FD',
    primaryDark: '#5B21B6',
    surface: '#EDE9FE',
    background: '#F5F3FF',
    tabBarActive: '#7C3AED',
    overlay: 'rgba(124, 58, 237, 0.08)',
    shadow: '#7C3AED',
    darkSurface: '#1E1340',
    darkBackground: '#120B28',
    darkCard: '#2D1B5E',
    darkBorder: '#3B2573',
    darkOverlay: 'rgba(124, 58, 237, 0.15)',
  },
  sunset: {
    label: 'Sunset Orange',
    icon: 'sunny',
    primary: '#F59E0B',
    primaryLight: '#FDE68A',
    primaryDark: '#D97706',
    surface: '#FEF3C7',
    background: '#FFFBEB',
    tabBarActive: '#F59E0B',
    overlay: 'rgba(245, 158, 11, 0.08)',
    shadow: '#F59E0B',
    darkSurface: '#2E1F0A',
    darkBackground: '#1A1206',
    darkCard: '#3D2A0E',
    darkBorder: '#523812',
    darkOverlay: 'rgba(245, 158, 11, 0.15)',
  },
  rose: {
    label: 'Rose Pink',
    icon: 'heart',
    primary: '#F43F5E',
    primaryLight: '#FDA4AF',
    primaryDark: '#BE123C',
    surface: '#FFE4E6',
    background: '#FFF1F2',
    tabBarActive: '#F43F5E',
    overlay: 'rgba(244, 63, 94, 0.08)',
    shadow: '#F43F5E',
    darkSurface: '#2E0F15',
    darkBackground: '#1A090D',
    darkCard: '#3D141C',
    darkBorder: '#521A25',
    darkOverlay: 'rgba(244, 63, 94, 0.15)',
  },
};

function buildColors(scheme: ColorScheme) {
  const accent = COLOR_SCHEMES[scheme];
  return {
    light: {
      primary: accent.primary,
      primaryLight: accent.primaryLight,
      primaryDark: accent.primaryDark,
      surface: accent.surface,
      background: accent.background,
      card: '#FFFFFF',
      text: '#0A1628',
      textSecondary: '#4A6274',
      textMuted: '#8BA4B8',
      border: '#D0E8F2',
      gold: '#D4A853',
      goldShimmer: '#F5D98C',
      goldDeep: '#B8860B',
      success: '#2EC4B6',
      error: '#FF6B6B',
      warning: '#FFB347',
      tabBar: '#FFFFFF',
      tabBarActive: accent.tabBarActive,
      tabBarInactive: '#8BA4B8',
      overlay: accent.overlay,
      shadow: accent.shadow,
    },
    dark: {
      primary: accent.primary,
      primaryLight: accent.darkSurface,
      primaryDark: accent.primaryLight,
      surface: accent.darkSurface,
      background: accent.darkBackground,
      card: accent.darkCard,
      text: '#E0F0FF',
      textSecondary: '#8BA4B8',
      textMuted: '#4A6274',
      border: accent.darkBorder,
      gold: '#D4A853',
      goldShimmer: '#F5D98C',
      goldDeep: '#F5D98C',
      success: '#2EC4B6',
      error: '#FF6B6B',
      warning: '#FFB347',
      tabBar: accent.darkBackground,
      tabBarActive: accent.tabBarActive,
      tabBarInactive: '#4A6274',
      overlay: accent.darkOverlay,
      shadow: '#000000',
    },
  };
}

export function getColors(scheme: ColorScheme = 'ocean') {
  return buildColors(scheme);
}

export const Colors = buildColors('ocean');

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const Shadows = {
  sm: {
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  gold: {
    shadowColor: '#D4A853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
