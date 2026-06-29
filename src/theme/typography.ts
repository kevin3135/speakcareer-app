import { Platform } from 'react-native';

export const fonts = {
  rounded: Platform.select({
    android: 'sans-serif-medium',
    ios: 'Avenir Next',
    web: 'Avenir Next, Nunito, ui-rounded, system-ui, sans-serif',
    default: undefined,
  }),
};

export const typography = {
  hero: 36,
  title: 31,
  h1: 27,
  h2: 22,
  h3: 18,
  body: 16,
  small: 13,
  micro: 11,
  lineHero: 42,
  lineTitle: 37,
  lineH1: 33,
  lineH2: 27,
  lineH3: 23,
  lineBody: 23,
  lineSmall: 18,
};
