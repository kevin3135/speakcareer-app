import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { RoleplayCard } from '../components/RoleplayCard';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { RoleplayId } from '../types';

type PracticeScreenProps = {
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
};

export function PracticeScreen({ onOpenRoleplay }: PracticeScreenProps) {
  return (
    <Screen
      title="Practice"
      subtitle="Short English drills for professional conversations."
    >
      {practiceContent.practiceModules.map((module) => (
        <Card key={module.id}>
          <View style={styles.moduleHeader}>
            <View style={styles.moduleTitleBlock}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.level}>{module.level}</Text>
            </View>
            <View style={styles.rewardPill}>
              <Text style={styles.rewardValue}>+{module.minutes * 3} XP</Text>
              <Text style={styles.minutes}>{module.minutes} min</Text>
            </View>
          </View>
          <Text style={styles.outcome}>{module.outcome}</Text>
          <View style={styles.drills}>
            {module.drills.map((drill) => (
              <View key={drill} style={styles.drillChip}>
                <Text style={styles.drill}>{drill}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Roleplays</Text>
        <Text style={styles.sectionMeta}>{practiceContent.roleplays.length} scenarios</Text>
      </View>
      {practiceContent.roleplays.map((roleplay) => (
        <RoleplayCard
          key={roleplay.id}
          roleplay={roleplay}
          onPress={() => onOpenRoleplay(roleplay.id)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  moduleHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moduleTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  moduleTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  rewardPill: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    minWidth: 76,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  rewardValue: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
  },
  minutes: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  outcome: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  level: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  drills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  drillChip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  drill: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
