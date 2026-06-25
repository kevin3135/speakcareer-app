import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { RoleplayCard } from '../components/RoleplayCard';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { RoleplayId } from '../types';

type HomeScreenProps = {
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
};

export function HomeScreen({ onOpenRoleplay }: HomeScreenProps) {
  const featured = practiceContent.roleplays[0];

  return (
    <Screen
      title="Today"
      subtitle="One focused English practice session is enough to keep momentum."
    >
      <Card muted>
        <Text style={styles.eyebrow}>Recommended next</Text>
        <Text style={styles.headline}>{featured.title}</Text>
        <Text style={styles.copy}>{featured.userGoal}</Text>
        <View style={styles.buttonRow}>
          <AppButton label="Open roleplay" onPress={() => onOpenRoleplay(featured.id)} />
        </View>
      </Card>

      <View style={styles.statGrid}>
        <Card>
          <Text style={styles.statNumber}>{progressData.summary.sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </Card>
        <Card>
          <Text style={styles.statNumber}>{progressData.summary.currentStreakDays}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Current focus</Text>
        <Text style={styles.copy}>{progressData.summary.nextFocus}</Text>
        <View style={styles.progressBlock}>
          <ProgressBar label="Clarity" value={progressData.summary.clarityScore} />
          <ProgressBar label="Confidence" value={progressData.summary.confidenceScore} />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Roleplay library</Text>
        <Text style={styles.sectionMeta}>English MVP</Text>
      </View>
      {practiceContent.roleplays.slice(0, 3).map((roleplay) => (
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
  eyebrow: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  headline: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  copy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  buttonRow: {
    marginTop: spacing.lg,
  },
  statGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statNumber: {
    color: colors.accent,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  progressBlock: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
