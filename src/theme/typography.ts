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
  hero: 34,
  title: 30,
  h1: 26,
  h2: 21,
  h3: 17,
  body: 15,
  small: 13,
  micro: 11,
  lineHero: 39,
  lineTitle: 35,
  lineH1: 31,
  lineH2: 26,
  lineH3: 22,
  lineBody: 22,
  lineSmall: 18,
};
