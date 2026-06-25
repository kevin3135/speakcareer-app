import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../styles/theme';
import type { RoleplayScenario } from '../types';

type RoleplayCardProps = {
  roleplay: RoleplayScenario;
  onPress: () => void;
};

export function RoleplayCard({ roleplay, onPress }: RoleplayCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{roleplay.title}</Text>
        <Text style={styles.minutes}>{roleplay.durationMinutes} min</Text>
      </View>
      <Text style={styles.focus}>{roleplay.focus}</Text>
      <Text style={styles.description}>{roleplay.description}</Text>
      <Text style={styles.meta}>{roleplay.targetLevel} - {roleplay.aiPersona}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.82,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  minutes: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '800',
  },
  focus: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
