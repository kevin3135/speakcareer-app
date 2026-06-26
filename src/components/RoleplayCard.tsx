import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../styles/theme';
import type { RoleplayScenario } from '../types';

type RoleplayCardProps = {
  roleplay: RoleplayScenario;
  onPress: () => void;
};

export function RoleplayCard({ roleplay, onPress }: RoleplayCardProps) {
  const xpReward = roleplay.durationMinutes * 4;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>{roleplay.targetLevel}</Text>
          <Text style={styles.title}>{roleplay.title}</Text>
        </View>
        <View style={styles.rewardPill}>
          <Text style={styles.reward}>+{xpReward} XP</Text>
          <Text style={styles.minutes}>{roleplay.durationMinutes} min</Text>
        </View>
      </View>
      <Text style={styles.focus}>{roleplay.focus}</Text>
      <Text style={styles.description}>{roleplay.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{roleplay.aiPersona}</Text>
        <Text style={styles.cta}>Start sprint</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.82,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  kicker: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  rewardPill: {
    alignItems: 'center',
    backgroundColor: colors.infoSoft,
    borderRadius: radii.md,
    minWidth: 76,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  reward: {
    color: colors.info,
    fontSize: typography.small,
    fontWeight: '900',
  },
  minutes: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  focus: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  cta: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
});
