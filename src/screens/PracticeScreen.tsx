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
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.minutes}>{module.minutes} min</Text>
          </View>
          <Text style={styles.outcome}>{module.outcome}</Text>
          <Text style={styles.level}>{module.level}</Text>
          <View style={styles.drills}>
            {module.drills.map((drill) => (
              <Text key={drill} style={styles.drill}>- {drill}</Text>
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
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  moduleTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  minutes: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
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
    marginTop: spacing.md,
  },
  drills: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  drill: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
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
