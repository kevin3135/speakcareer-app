import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { RoleplayCard } from '../components/RoleplayCard';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';

type HomeScreenProps = {
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
};

export function HomeScreen({ onOpenRoleplay }: HomeScreenProps) {
  const featured = practiceContent.roleplays[0];
  const dailyMission = createDailyMission(progressData.summary);

  return (
    <Screen
      title="SpeakCareer"
      subtitle="Daily career English practice, built for momentum."
    >
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleBlock}>
            <Text style={styles.heroKicker}>Daily mission</Text>
            <Text style={styles.heroTitle}>{dailyMission.title}</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelNumber}>{dailyMission.level}</Text>
          </View>
        </View>
        <Text style={styles.heroCopy}>{featured.userGoal}</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{dailyMission.streakDays}</Text>
            <Text style={styles.heroStatLabel}>day streak</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{dailyMission.xpTotal}</Text>
            <Text style={styles.heroStatLabel}>career XP</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{dailyMission.rewardLabel}</Text>
            <Text style={styles.heroStatLabel}>reward</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <AppButton label="Start mission" onPress={() => onOpenRoleplay(featured.id)} />
        </View>
      </View>

      <View style={styles.statGrid}>
        <View style={[styles.statCard, styles.statCardLeft]}>
          <Text style={styles.statNumber}>{progressData.summary.sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progressData.summary.currentStreakDays}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily goal</Text>
          <Text style={styles.sectionMeta}>{dailyMission.xpToday}/{dailyMission.xpGoal} XP</Text>
        </View>
        <View style={styles.progressBlock}>
          <ProgressBar label="Mission progress" value={dailyMission.progressPercent} />
        </View>
        <Text style={styles.copy}>{progressData.summary.nextFocus}</Text>
      </Card>

      <Card muted>
        <Text style={styles.sectionTitle}>Career path</Text>
        <View style={styles.pathStep}>
          <Text style={styles.stepBadge}>1</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Read the prompt</Text>
            <Text style={styles.stepCopy}>Understand the workplace situation.</Text>
          </View>
        </View>
        <View style={styles.pathStep}>
          <Text style={styles.stepBadge}>2</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Answer out loud or type</Text>
            <Text style={styles.stepCopy}>Use clear structure and professional phrases.</Text>
          </View>
        </View>
        <View style={styles.pathStep}>
          <Text style={styles.stepBadge}>3</Text>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Save the session</Text>
            <Text style={styles.stepCopy}>Build your progress history and mistake bank.</Text>
          </View>
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
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    padding: spacing.xl,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroKicker: {
    color: '#BFE7E1',
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  heroCopy: {
    color: '#E4F4F1',
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  heroStats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  heroStat: {
    flex: 1,
  },
  heroStatValue: {
    color: colors.surface,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  heroStatLabel: {
    color: '#BFE7E1',
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  levelPill: {
    alignItems: 'center',
    backgroundColor: '#F5C46B',
    borderRadius: 8,
    minWidth: 62,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  levelLabel: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  levelNumber: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
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
  },
  statCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: spacing.lg,
  },
  statCardLeft: {
    marginRight: spacing.md,
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
    marginTop: spacing.lg,
  },
  pathStep: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  stepBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '900',
    height: 34,
    lineHeight: 34,
    marginRight: spacing.md,
    overflow: 'hidden',
    textAlign: 'center',
    width: 34,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  stepCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
