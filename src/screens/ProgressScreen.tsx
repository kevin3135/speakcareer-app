import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createLessonCompleteSummary } from '../utils/lessonComplete';
import { createLocalProgressStats } from '../utils/localProgress';
import { createMistakePracticeDrill, createMistakePracticeStatus } from '../utils/mistakePracticeDrill';
import { createProgressEmptyState } from '../utils/progressEmptyState';
import { createProgressMistakeBankPreview } from '../utils/progressMistakeBankPreview';
import { createProgressNextStepGuide } from '../utils/progressNextStep';
import { formatSessionDate } from '../utils/sessionHistory';

type ProgressScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function ProgressScreen({ dailyTarget, onOpenRoleplay, sessions }: ProgressScreenProps) {
  const [isMistakeDrillPracticed, setIsMistakeDrillPracticed] = useState(false);
  const { summary, mistakeBank } = progressData;
  const completionSummary = createLessonCompleteSummary(sessions);
  const localProgress = createLocalProgressStats(summary, sessions, dailyTarget);
  const mistakeDrill = createMistakePracticeDrill(mistakeBank);
  const mistakePracticeStatus = createMistakePracticeStatus(isMistakeDrillPracticed);
  const progressEmptyState = createProgressEmptyState();
  const mistakeBankPreview = createProgressMistakeBankPreview(mistakeBank);
  const progressGuide = createProgressNextStepGuide({
    dailyTarget,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const hasSavedSessions = sessions.length > 0;

  return (
    <Screen
      title="Progress"
      subtitle="A simple mistake bank for recurring English career communication patterns."
    >
      <View style={styles.guideCard}>
        <Text style={styles.guideKicker}>{progressGuide.eyebrow}</Text>
        <Text style={styles.guideTitle}>{progressGuide.title}</Text>
        <Text style={styles.guideBody}>{progressGuide.body}</Text>
        <View style={styles.guideSteps}>
          {progressGuide.steps.map((step, index) => (
            <View key={step} style={styles.guideStepRow}>
              <View style={styles.guideStepNumber}>
                <Text style={styles.guideStepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.guideStepText}>{step}</Text>
            </View>
          ))}
        </View>
        <View style={styles.guideAction}>
          <AppButton
            accessibilityHint="Opens the recommended next roleplay from Progress"
            label={progressGuide.ctaLabel}
            onPress={() => onOpenRoleplay(progressGuide.roleplayId)}
          />
        </View>
      </View>

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
        <View style={styles.emptyQuestCard}>
          <View style={styles.emptyQuestHeader}>
            <View style={styles.emptyQuestTitleBlock}>
              <Text style={styles.emptyQuestKicker}>{progressEmptyState.eyebrow}</Text>
              <Text style={styles.emptyQuestTitle}>{progressEmptyState.title}</Text>
            </View>
            <View style={styles.emptyQuestReward}>
              <Text style={styles.emptyQuestRewardValue}>{progressEmptyState.rewardLabel}</Text>
              <Text style={styles.emptyQuestRewardLabel}>Reward</Text>
            </View>
          </View>
          <Text style={styles.emptyQuestBody}>{progressEmptyState.body}</Text>
          <View style={styles.emptyQuestProgress}>
            <Text style={styles.emptyQuestProgressLabel}>{progressEmptyState.progressLabel}</Text>
            <View style={styles.emptyQuestProgressTrack}>
              <View style={styles.emptyQuestProgressFill} />
            </View>
          </View>
          <View style={styles.emptyQuestSteps}>
            {progressEmptyState.steps.map((step, index) => (
              <View key={step} style={styles.emptyQuestStepRow}>
                <View style={styles.emptyQuestStepNumber}>
                  <Text style={styles.emptyQuestStepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.emptyQuestStepText}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.emptyQuestAction}>
            <AppButton
              accessibilityHint="Starts the first roleplay needed to unlock Progress history"
              label={progressEmptyState.ctaLabel}
              onPress={() => onOpenRoleplay(progressEmptyState.roleplayId)}
            />
          </View>
        </View>
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
      {hasSavedSessions ? (
        <>
          {mistakeDrill ? (
            <Card>
              <Text style={styles.drillKicker}>{mistakeDrill.eyebrow}</Text>
              <Text style={styles.drillTitle}>{mistakeDrill.title}</Text>
              <Text style={styles.drillBody}>{mistakeDrill.body}</Text>
              <View style={styles.drillCompare}>
                <View style={styles.drillBoxMuted}>
                  <Text style={styles.drillLabel}>Instead of</Text>
                  <Text style={styles.drillOriginal}>{mistakeDrill.mistake.original}</Text>
                </View>
                <View style={styles.drillBoxStrong}>
                  <Text style={styles.drillLabelStrong}>Say this</Text>
                  <Text style={styles.drillCorrection}>{mistakeDrill.mistake.correction}</Text>
                </View>
              </View>
              <View style={styles.drillSteps}>
                {mistakeDrill.steps.map((step, index) => (
                  <View key={step} style={styles.drillStepRow}>
                    <Text style={styles.drillStepNumber}>{index + 1}</Text>
                    <Text style={styles.drillStepText}>{step}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.drillStatus}>
                <Text style={styles.drillStatusLabel}>{mistakePracticeStatus.label}</Text>
                <Text style={styles.drillStatusBody}>{mistakePracticeStatus.body}</Text>
              </View>
              <View style={styles.drillAction}>
                <AppButton
                  accessibilityHint="Marks this correction drill as practiced for this session"
                  label={mistakePracticeStatus.ctaLabel}
                  onPress={() => setIsMistakeDrillPracticed(true)}
                  variant={isMistakeDrillPracticed ? 'quiet' : 'primary'}
                />
              </View>
              <View style={styles.drillSecondaryAction}>
                <AppButton
                  accessibilityHint="Opens the roleplay connected to this mistake correction"
                  label={mistakeDrill.ctaLabel}
                  onPress={() => onOpenRoleplay(mistakeDrill.roleplayId)}
                  variant="secondary"
                />
              </View>
            </Card>
          ) : null}
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
        </>
      ) : mistakeBankPreview ? (
        <Card>
          <Text style={styles.previewKicker}>{mistakeBankPreview.eyebrow}</Text>
          <Text style={styles.previewTitle}>{mistakeBankPreview.title}</Text>
          <Text style={styles.previewBody}>{mistakeBankPreview.body}</Text>
          <View style={styles.previewProgress}>
            <Text style={styles.previewProgressLabel}>{mistakeBankPreview.progressLabel}</Text>
            <Text style={styles.previewProgressMeta}>{mistakeBankPreview.totalPatternsLabel}</Text>
          </View>
          <View style={styles.previewCorrectionCard}>
            <Text style={styles.previewCategory}>{mistakeBankPreview.previewCategory}</Text>
            <Text style={styles.previewLabel}>{mistakeBankPreview.previewLabel}</Text>
            <Text style={styles.previewCorrection}>{mistakeBankPreview.previewCorrection}</Text>
            <Text style={styles.previewNote}>{mistakeBankPreview.previewNote}</Text>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  guideCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BDE7DC',
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.xl,
  },
  guideKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  guideTitle: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: spacing.sm,
  },
  guideBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  guideSteps: {
    marginTop: spacing.lg,
  },
  guideStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  guideStepNumber: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 28,
  },
  guideStepNumberText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  guideStepText: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 21,
  },
  guideAction: {
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
  emptyQuestAction: {
    marginTop: spacing.lg,
  },
  emptyQuestBody: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.md,
  },
  emptyQuestCard: {
    backgroundColor: colors.surface,
    borderColor: '#BDE7DC',
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.xl,
  },
  emptyQuestHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyQuestKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  emptyQuestProgress: {
    marginTop: spacing.lg,
  },
  emptyQuestProgressFill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    width: '0%',
  },
  emptyQuestProgressLabel: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  emptyQuestProgressTrack: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  emptyQuestReward: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    marginLeft: spacing.md,
    minWidth: 72,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  emptyQuestRewardLabel: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 1,
    textTransform: 'uppercase',
  },
  emptyQuestRewardValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  emptyQuestStepNumber: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 28,
  },
  emptyQuestStepNumberText: {
    color: colors.surface,
    fontSize: typography.small,
    fontWeight: '900',
  },
  emptyQuestStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  emptyQuestStepText: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 21,
  },
  emptyQuestSteps: {
    marginTop: spacing.lg,
  },
  emptyQuestTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: 25,
    marginTop: spacing.xs,
  },
  emptyQuestTitleBlock: {
    flex: 1,
  },
  previewBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  previewCategory: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  previewCorrection: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  previewCorrectionCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BDE7DC',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  previewKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  previewLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  previewNote: {
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  previewProgress: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  previewProgressLabel: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
  },
  previewProgressMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginLeft: spacing.md,
  },
  previewTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: 25,
    marginTop: spacing.xs,
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
  drillKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  drillTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: 25,
    marginTop: spacing.sm,
  },
  drillBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  drillCompare: {
    marginTop: spacing.lg,
  },
  drillBoxMuted: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  drillBoxStrong: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BDE7DC',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  drillLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  drillLabelStrong: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  drillOriginal: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  drillCorrection: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  drillSteps: {
    marginTop: spacing.lg,
  },
  drillStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  drillStepNumber: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '900',
    marginRight: spacing.md,
  },
  drillStepText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    lineHeight: 22,
  },
  drillAction: {
    marginTop: spacing.lg,
  },
  drillSecondaryAction: {
    marginTop: spacing.sm,
  },
  drillStatus: {
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  drillStatusLabel: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  drillStatusBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
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
