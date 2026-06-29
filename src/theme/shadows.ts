import { colors } from './colors';

export const shadows = {
  soft: {
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
  },
  medium: {
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
  },
  button: {
    elevation: 5,
    shadowColor: colors.primaryDark,
    shadowOffset: { height: 7, width: 0 },
    shadowOpacity: 0.26,
    shadowRadius: 12,
  },
  node: {
    elevation: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
};
