import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../styles/theme';

type ProgressBarProps = {
  label: string;
  value: number;
};

export function ProgressBar({ label, value }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(value, 100))}%`;

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  value: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  track: {
    backgroundColor: colors.border,
    borderRadius: radii.sm,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    height: 8,
  },
});
