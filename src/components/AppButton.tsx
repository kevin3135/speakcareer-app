import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radii, spacing, typography } from '../styles/theme';

type AppButtonProps = {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'quiet';
};

export function AppButton({
  accessibilityHint,
  accessibilityLabel,
  disabled = false,
  label,
  onPress,
  variant = 'primary',
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primary: {
    backgroundColor: colors.primary,
    elevation: 1,
    shadowColor: colors.primaryDark,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  quiet: {
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  primaryLabel: {
    color: colors.surface,
  },
  secondaryLabel: {
    color: colors.text,
  },
});
