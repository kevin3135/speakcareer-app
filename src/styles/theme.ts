import { Platform } from 'react-native';

export const colors = {
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#ECF5F2',
  text: '#263238',
  textMuted: '#65737E',
  border: '#D9E2EA',
  primary: '#168A6B',
  primaryDark: '#0B4F46',
  primarySoft: '#DFF3EC',
  accent: '#F0A51A',
  accentSoft: '#FFF0C7',
  info: '#2563EB',
  infoSoft: '#E6EEFF',
  success: '#25855A',
  danger: '#B42318',
  ink: '#111827',
};

export const fonts = {
  rounded: Platform.select({
    android: 'sans-serif-medium',
    ios: 'Avenir Next',
    web: 'Avenir Next, Nunito, ui-rounded, system-ui, sans-serif',
    default: undefined,
  }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 8,
};

export const typography = {
  title: 32,
  h1: 26,
  h2: 20,
  h3: 16,
  body: 15,
  small: 13,
};
