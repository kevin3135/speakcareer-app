import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../styles/theme';

type CardProps = PropsWithChildren<{
  muted?: boolean;
}>;

export function Card({ children, muted = false }: CardProps) {
  return <View style={[styles.card, muted && styles.muted]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    elevation: 1,
    padding: spacing.lg,
    shadowColor: colors.ink,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
});
