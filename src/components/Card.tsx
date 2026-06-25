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
    padding: spacing.lg,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
});
