import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Screen } from '../components/Screen';
import { progressData } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createLessonCompleteSummary } from '../utils/lessonComplete';
import { createLocalProgressStats } from '../utils/localProgress';
import { createProgressEmptyState } from '../utils/progressEmptyState';
import { formatSessionDate } from '../utils/sessionHistory';

type ProgressScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function ProgressScreen({ dailyTarget, onOpenRoleplay, sessions }: ProgressScreenProps) {
  const { summary, mistakeBank } = progressData;
  const completionSummary = createLessonCompleteSummary(sessions);
  const localProgress = createLocalProgressStats(summary, sessions, dailyTarget);
  const progressEmptyState = createProgressEmptyState();
  const hasNoSavedSessions = sessions.length === 0;

  return (
    <Screen
      title="Progress"
      subtitle="A simple mistake bank for recurring English career communication patterns."
    >
      {hasNoSavedSessions ? (
        <View style={styles.emptyHero}>
          <Text style={styles.emptyKicker}>First progress step</Text>
          <Text style={styles.emptyHeroTitle}>{progressEmptyState.title}</Text>
          <Text style={styles.emptyHeroCopy}>{progressEmptyState.body}</Text>
          <View style={styles.emptySteps}>
            {progressEmptyState.steps.map((step, index) => (
              <View key={step} style={styles.emptyStepRow}>
                <View style={styles.emptyStepNumber}>
                  <Text style={styles.emptyStepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.emptyStepText}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.emptyAction}>
            <AppButton
              label={progressEmptyState.ctaLabel}
              onPress={() => onOpenRoleplay(progressEmptyState.roleplayId)}
            />
          </View>
        </View>
      ) : null}

      {completionSummary ? (
        <View style={styles.completeCard}>
          <View style={styles.completeHeader}>
            <View style={styles.completeTitleBlock}>
              <Text style={styles.completeKicker}>Lesson complete</Text>
              <Text style={styles.completeTitle}>{completionSummary.latestSession.roleplayTitle}</Text>
            </View>
            <View style={styles.completeXpPill}>
              <Text style={styles.completeXp}>+{completionSummary.latestSession.xpReward}</Text>
              <Text style={styles.completeXpLabel}>XP</Text>
            </View>
          </View>
          <View style={styles.completeStats}>
            <View style={styles.completeStat}>
              <Text style={styles.completeStatValue}>{completionSummary.latestSession.wordCount}</Text>
              <Text style={styles.completeStatLabel}>words</Text>
            </View>
            <View style={styles.completeStat}>
              <Text style={styles.completeStatValue}>{sessions.length}</Text>
              <Text style={styles.completeStatLabel}>saved</Text>
            </View>
            <View style={styles.completeStat}>
              <Text style={styles.completeStatValue}>{completionSummary.totalLocalXp}</Text>
              <Text style={styles.completeStatLabel}>local XP</Text>
            </View>
          </View>
          <Text style={styles.completeNext}>{completionSummary.nextAction}</Text>
        </View>
      ) : null}

      <Card>
        <View style={styles.targetHeader}>
          <View>
            <Text style={styles.sectionTitle}>Daily target</Text>
            <Text style={styles.targetMeta}>
              {localProgress.targetSessionsCompleted}/{dailyTarget} roleplay{dailyTarget === 1 ? '' : 's'} completed
            </Text>
          </View>
          <View style={styles.targetPill}>
            <Text style={styles.targetPillValue}>{localProgress.targetSessionsRemaining}</Text>
            <Text style={styles.targetPillLabel}>left</Text>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <ProgressBar label="Target completion" value={localProgress.targetCompletionPercent} />
        </View>
      </Card>

      <View style={styles.statGrid}>
        <Card>
          <Text style={styles.statNumber}>{localProgress.minutesPracticed}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </Card>
        <Card>
          <Text style={styles.statNumber}>{localProgress.sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Skill snapshot</Text>
        <View style={styles.progressBlock}>
          <ProgressBar label="Clarity" value={summary.clarityScore} />
          <ProgressBar label="Confidence" value={summary.confidenceScore} />
        </View>
        <Text style={styles.nextFocus}>Next focus: {summary.nextFocus}</Text>
      </Card>

      <Text style={styles.sectionTitle}>Session history</Text>
      {sessions.length === 0 ? (
        <Card muted>
          <Text style={styles.emptyTitle}>No saved sessions yet</Text>
          <Text style={styles.emptyCopy}>
            Your saved roleplay sessions will appear here after your first review.
          </Text>
        </Card>
      ) : (
        sessions.map((session) => (
          <Card key={session.id}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{session.roleplayTitle}</Text>
              <Text style={styles.sessionDate}>{formatSessionDate(session.completedAt)}</Text>
            </View>
            <View style={styles.sessionMetaRow}>
              <Text style={styles.sessionMeta}>
                {session.readinessLabel} - {session.wordCount} words
              </Text>
              <Text style={styles.sessionXp}>+{session.xpReward} XP</Text>
            </View>
            <Text style={styles.sessionPreview}>{session.answerPreview}</Text>
            <Text style={styles.sessionFeedback}>{session.feedbackSummary}</Text>
          </Card>
        ))
      )}

      <Text style={styles.sectionTitle}>Mistake bank</Text>
      {mistakeBank.map((mistake) => (
        <Card key={mistake.id}>
          <View style={styles.mistakeHeader}>
            <Text style={styles.category}>{mistake.category}</Text>
            <Text style={[styles.priority, styles[`priority${mistake.priority}`]]}>{mistake.priority}</Text>
          </View>
          <Text style={styles.label}>Original</Text>
          <Text style={styles.original}>{mistake.original}</Text>
          <Text style={styles.label}>Correction</Text>
          <Text style={styles.correction}>{mistake.correction}</Text>
          <Text style={styles.note}>{mistake.note}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyHero: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    padding: spacing.xl,
  },
  emptyKicker: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  emptyHeroTitle: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: spacing.sm,
  },
  emptyHeroCopy: {
    color: '#D7DEE8',
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  emptySteps: {
    marginTop: spacing.lg,
  },
  emptyStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  emptyStepNumber: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 28,
  },
  emptyStepNumberText: {
    color: colors.surface,
    fontSize: typography.small,
    fontWeight: '900',
  },
  emptyStepText: {
    color: colors.surface,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 21,
  },
  emptyAction: {
    marginTop: spacing.lg,
  },
  completeCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    padding: spacing.xl,
  },
  completeHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completeTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  completeKicker: {
    color: '#BFE7E1',
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  completeTitle: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: spacing.xs,
  },
  completeXpPill: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    minWidth: 68,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  completeXp: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  completeXpLabel: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  completeStats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  completeStat: {
    flex: 1,
  },
  completeStatValue: {
    color: colors.surface,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  completeStatLabel: {
    color: '#BFE7E1',
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  completeNext: {
    color: '#E4F4F1',
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  statGrid: {
    flexDirection: 'row',
  },
  targetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  targetPill: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    minWidth: 62,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  targetPillValue: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  targetPillLabel: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
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
  sectionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  progressBlock: {
    marginTop: spacing.lg,
  },
  nextFocus: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  sessionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  sessionDate: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  sessionMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  sessionMeta: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '900',
  },
  sessionXp: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
    marginLeft: spacing.md,
  },
  sessionPreview: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  sessionFeedback: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  mistakeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  priority: {
    fontSize: typography.small,
    fontWeight: '900',
  },
  priorityHigh: {
    color: colors.danger,
  },
  priorityMedium: {
    color: colors.accent,
  },
  priorityLow: {
    color: colors.success,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
  original: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  correction: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  note: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.lg,
  },
});
