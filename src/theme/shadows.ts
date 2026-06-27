import { colors } from './colors';

export const shadows = {
  soft: {
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  medium: {
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  button: {
    elevation: 3,
    shadowColor: colors.primaryDark,
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
};
