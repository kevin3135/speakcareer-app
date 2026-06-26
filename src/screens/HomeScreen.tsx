import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { LearningPath, type LearningPathStep } from '../components/LearningPath';
import { ProgressBar } from '../components/ProgressBar';
import { RoleplayCard } from '../components/RoleplayCard';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createLocalProgressStats } from '../utils/localProgress';

type HomeScreenProps = {
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function HomeScreen({ onOpenRoleplay, sessions }: HomeScreenProps) {
  const featured = practiceContent.roleplays[0];
  const dailyMission = createDailyMission(progressData.summary, sessions);
  const localProgress = createLocalProgressStats(progressData.summary, sessions);
  const hasSavedSession = sessions.length > 0;
  const pathSteps: LearningPathStep[] = [
    {
      id: 'warm-up',
      title: 'Warm up phrases',
      caption: 'Review three strong interview phrases.',
      state: 'done',
      xpLabel: '+10 XP',
    },
    {
      id: 'roleplay',
      title: featured.title,
      caption: hasSavedSession ? 'Your latest sprint is saved.' : 'Complete one 5-minute career sprint.',
      state: hasSavedSession ? 'done' : 'active',
      xpLabel: dailyMission.rewardLabel,
      onPress: () => onOpenRoleplay(featured.id),
    },
    {
      id: 'feedback',
      title: 'Review feedback',
      caption: hasSavedSession
        ? 'Progress is updated from your saved session.'
        : 'Save the session and bank one mistake to improve.',
      state: hasSavedSession ? 'active' : 'locked',
      xpLabel: '+15 XP',
    },
  ];

  return (
    <Screen
      title="SpeakCareer"
      subtitle="Daily career English practice, built for momentum."
    >
      <View style={styles.statusRail}>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{dailyMission.streakDays}</Text>
          <Text style={styles.statusLabel}>Streak</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{dailyMission.level}</Text>
          <Text style={styles.statusLabel}>Level</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{dailyMission.xpToday}</Text>
          <Text style={styles.statusLabel}>Today XP</Text>
        </View>
      </View>

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
          <Text style={styles.statNumber}>{localProgress.sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{localProgress.currentStreakDays}</Text>
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
        <Text style={styles.copy}>
          {hasSavedSession
            ? `${sessions.length} saved session${sessions.length === 1 ? '' : 's'} this run. ${localProgress.totalLocalXp} local XP added.`
            : progressData.summary.nextFocus}
        </Text>
      </Card>

      <Card muted>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily path</Text>
          <Text style={styles.sectionMeta}>3 steps</Text>
        </View>
        <View style={styles.pathBlock}>
          <LearningPath steps={pathSteps} />
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
  statusRail: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.sm,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusValue: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: spacing.xs,
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
  pathBlock: {
    marginTop: spacing.md,
  },
});
