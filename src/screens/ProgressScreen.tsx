import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  SkillProgressCard,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayWarmupCue } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createLocalProgressStats } from '../utils/localProgress';
import { createMistakePracticeDrill, createMistakePracticeStatus } from '../utils/mistakePracticeDrill';
import { createProgressEmptyState } from '../utils/progressEmptyState';
import { createProgressMistakeBankQueue } from '../utils/progressMistakeBankQueue';
import { createProgressMistakeBankPreview } from '../utils/progressMistakeBankPreview';
import { createProgressNextStepGuide } from '../utils/progressNextStep';
import { createRoleplayWarmupCue } from '../utils/roleplayWarmupCue';
import { formatSessionDate } from '../utils/sessionHistory';

type ProgressScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onMarkMistakePracticed: (mistakeId: string) => void;
  onOpenRoleplay: (roleplayId: RoleplayId, warmupCue?: RoleplayWarmupCue) => void;
  practicedMistakeIds: string[];
  sessions: PracticeSession[];
};

const weekActivity = [28, 44, 18, 65, 40, 72, 55];

export function ProgressScreen({
  dailyTarget,
  onMarkMistakePracticed,
  onOpenRoleplay,
  practicedMistakeIds,
  sessions,
}: ProgressScreenProps) {
  const [isMistakeQueueOpen, setIsMistakeQueueOpen] = useState(false);
  const { summary, mistakeBank } = progressData;
  const mission = createDailyMission(summary, sessions, dailyTarget);
  const localProgress = createLocalProgressStats(summary, sessions, dailyTarget);
  const totalXp = mission.xpTotal;
  const latestSession = sessions[0];
  const latestSessionFocusText = latestSession?.nextFocusText?.trim() ?? '';
  const isFirstSaveLocked = sessions.length === 0;
  const mistakesFixed = sessions.length > 0 ? Math.min(mistakeBank.length, sessions.length + 1) : 0;
  const nextStepGuide = createProgressNextStepGuide({
    dailyTarget,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const primaryGuideStep = nextStepGuide.steps[0];
  const emptyState = isFirstSaveLocked ? createProgressEmptyState() : null;
  const mistakePreview = isFirstSaveLocked ? createProgressMistakeBankPreview(mistakeBank) : null;
  const mistakeDrill = isFirstSaveLocked
    ? null
    : createMistakePracticeDrill(mistakeBank, practicedMistakeIds);
  const mistakeQueue = isFirstSaveLocked
    ? null
    : createProgressMistakeBankQueue(mistakeBank, practicedMistakeIds);
  const isTopMistakePracticed = mistakeDrill
    ? practicedMistakeIds.includes(mistakeDrill.mistake.id)
    : false;
  const mistakePracticeStatus = mistakeDrill
    ? createMistakePracticeStatus(isTopMistakePracticed)
    : null;
  const visibleMistakeQueueItems = mistakeQueue
    ? mistakeQueue.items.slice(0, isMistakeQueueOpen ? mistakeQueue.items.length : 1)
    : [];
  const hiddenMistakeQueueCount = mistakeQueue
    ? Math.max(0, mistakeQueue.items.length - visibleMistakeQueueItems.length)
    : 0;

  return (
    <ScreenContainer
      overline="Wins"
      right={<StreakBadge label={`${mission.streakDays} day streak`} />}
      subtitle="Track the useful practice wins, not a confusing dashboard."
      title="Your progress"
    >
      <GradientHero
        overline="Career momentum"
        subtitle="Every saved answer builds your English confidence and unlocks sharper feedback."
        title={`${totalXp} total XP`}
        tone="primary"
      >
        <View style={styles.heroBadges}>
          <XPBadge label={`${sessions.length} saved`} />
          <Badge label={`${mistakesFixed} mistakes fixed`} tone="secondary" />
        </View>
      </GradientHero>

      <Card tone="strong">
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.cardKicker}>{nextStepGuide.eyebrow}</Text>
            <Text style={styles.cardTitle}>{nextStepGuide.title}</Text>
          </View>
          <Badge label={nextStepGuide.statusLabel} tone={nextStepGuide.statusTone} />
        </View>
        <Text numberOfLines={2} style={styles.cardBody}>{nextStepGuide.body}</Text>
        {primaryGuideStep ? (
          <View style={styles.nextFocusBox}>
            <Text style={styles.nextFocusLabel}>Do now</Text>
            <Text style={styles.nextFocusText}>{primaryGuideStep}</Text>
          </View>
        ) : null}
        {!isFirstSaveLocked ? (
          <View style={styles.progressWrap}>
            <ProgressBar
              label={`${localProgress.targetSessionsCompleted}/${dailyTarget} roleplays today`}
              value={localProgress.targetCompletionPercent}
              tone="secondary"
            />
          </View>
        ) : null}
        <View style={styles.cardAction}>
          <AppButton
            label={nextStepGuide.ctaLabel}
            onPress={() => onOpenRoleplay(nextStepGuide.roleplayId)}
          />
        </View>
      </Card>

      {isFirstSaveLocked ? (
        <>
          {emptyState ? (
            <Card tone="muted">
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.cardKicker}>{emptyState.eyebrow}</Text>
                  <Text style={styles.cardTitle}>{emptyState.title}</Text>
                </View>
                <Badge label={emptyState.progressLabel} tone="info" />
              </View>
              <Text style={styles.cardBody}>{emptyState.body}</Text>
              <Text style={styles.unlockLabel}>{emptyState.unlockLabel}</Text>
            </Card>
          ) : null}

          {mistakePreview ? (
            <Card>
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.cardKicker}>{mistakePreview.eyebrow}</Text>
                  <Text style={styles.cardTitle}>{mistakePreview.title}</Text>
                </View>
                <Badge label={mistakePreview.progressLabel} tone="info" />
              </View>
              <Text style={styles.cardBody}>{mistakePreview.body}</Text>
              <View style={styles.lockedPreview}>
                <View style={styles.rowBetween}>
                  <Badge label={mistakePreview.previewCategory} tone="secondary" />
                  <Text style={styles.previewTotal}>{mistakePreview.totalPatternsLabel}</Text>
                </View>
                <Text style={styles.previewLabel}>{mistakePreview.previewLabel}</Text>
                <Text style={styles.previewCorrection}>{mistakePreview.previewCorrection}</Text>
                <Text style={styles.previewNote}>{mistakePreview.previewNote}</Text>
              </View>
            </Card>
          ) : null}
        </>
      ) : (
        <>
          <Card style={styles.statStrip} tone="muted">
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.minutesPracticed}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{localProgress.sessionsCompleted}</Text>
              <Text style={styles.statLabel}>Roleplays</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mistakesFixed}</Text>
              <Text style={styles.statLabel}>Fixes</Text>
            </View>
          </Card>

          {latestSession ? (
            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.cardKicker}>Latest win</Text>
                {latestSession.includedFollowUp ? <Badge label="Follow-up saved" tone="success" /> : null}
              </View>
              <Text style={styles.cardTitle}>{latestSession.roleplayTitle}</Text>
              <Text style={styles.metaLine}>
                {formatSessionDate(latestSession.completedAt)} - {latestSession.wordCount} words - +{latestSession.xpReward} XP
              </Text>
              {latestSessionFocusText ? (
                <>
                  <View style={styles.latestFocusBox}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.latestFocusLabel}>Next correction</Text>
                      <Badge
                        label={latestSession.nextFocusLabel?.trim() || 'Coach target'}
                        tone="accent"
                      />
                    </View>
                    <Text style={styles.latestFocusText}>{latestSessionFocusText}</Text>
                  </View>
                  <View style={styles.latestAnswerBox}>
                    <Text style={styles.latestAnswerLabel}>Saved answer</Text>
                    <Text numberOfLines={1} style={styles.latestAnswerText}>
                      {latestSession.answerPreview}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text numberOfLines={2} style={styles.sessionPreview}>
                    {latestSession.answerPreview}
                  </Text>
                  <Text numberOfLines={2} style={styles.sessionFeedback}>
                    {latestSession.feedbackSummary}
                  </Text>
                </>
              )}
              <View style={styles.cardAction}>
                <AppButton
                  label="Retry this scenario"
                  onPress={() => onOpenRoleplay(latestSession.roleplayId)}
                  variant="secondary"
                />
              </View>
            </Card>
          ) : null}

          <SectionHeader
            subtitle="Simple skill meters for the English you need at work."
            title="Skill progress"
          />
          <View style={styles.skillGrid}>
            <SkillProgressCard label="Clarity" tone="primary" value={summary.clarityScore} />
            <SkillProgressCard label="Confidence" tone="purple" value={summary.confidenceScore} />
          </View>
          <View style={styles.skillGrid}>
            <SkillProgressCard label="Tone" tone="secondary" value={76} />
            <SkillProgressCard label="Structure" tone="accent" value={82} />
          </View>

          <Card style={styles.weekCard} tone="muted">
            <Text style={styles.cardKicker}>Weekly rhythm</Text>
            <View style={styles.chart}>
              {weekActivity.map((value, index) => (
                <View key={`${value}-${index}`} style={styles.chartColumn}>
                  <View style={[styles.chartBar, { height: value }]} />
                  <Text style={styles.chartLabel}>{index + 1}</Text>
                </View>
              ))}
            </View>
          </Card>

          {mistakeDrill ? (
            <Card tone="accent">
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.cardKicker}>{mistakeDrill.eyebrow}</Text>
                  <Text style={styles.cardTitle}>{mistakeDrill.title}</Text>
                </View>
                <Badge label={mistakeDrill.mistake.category} tone="secondary" />
              </View>
              <Text style={styles.cardBody}>{mistakeDrill.body}</Text>
              <View style={styles.mistakeCorrection}>
                <Text style={styles.mistakeLabelStrong}>Say this next time</Text>
                <Text style={styles.mistakeText}>{mistakeDrill.mistake.correction}</Text>
              </View>
              <View style={styles.guideSteps}>
                {mistakeDrill.steps.map((step, index) => (
                  <View key={step} style={styles.guideStepRow}>
                    <View style={styles.guideStepIndex}>
                      <Text style={styles.guideStepIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.guideStepText}>{step}</Text>
                  </View>
                ))}
              </View>
              {mistakePracticeStatus ? (
                <View style={styles.practiceStatusBox}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.mistakeLabelStrong}>{mistakePracticeStatus.label}</Text>
                    <Badge
                      label={isTopMistakePracticed ? 'Saved locally' : '1 quick repeat'}
                      tone={isTopMistakePracticed ? 'success' : 'info'}
                    />
                  </View>
                  <Text style={styles.practiceStatusBody}>{mistakePracticeStatus.body}</Text>
                  <View style={styles.practiceStatusAction}>
                    <AppButton
                      disabled={isTopMistakePracticed}
                      label={mistakePracticeStatus.ctaLabel}
                      onPress={() => onMarkMistakePracticed(mistakeDrill.mistake.id)}
                      variant={isTopMistakePracticed ? 'quiet' : 'secondary'}
                    />
                  </View>
                </View>
              ) : null}
              <View style={styles.cardAction}>
                <AppButton
                  label={mistakeDrill.ctaLabel}
                  onPress={() =>
                    onOpenRoleplay(
                      mistakeDrill.roleplayId,
                      createRoleplayWarmupCue(mistakeDrill.mistake),
                    )
                  }
                />
              </View>
            </Card>
          ) : null}

          <SectionHeader
            subtitle="One correction first. Open the full list only when needed."
            title="Mistake bank"
          />
          {mistakeQueue ? (
            <Card tone="muted">
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.cardKicker}>{mistakeQueue.eyebrow}</Text>
                  <Text style={styles.cardTitle}>{mistakeQueue.title}</Text>
                </View>
                <Badge label={mistakeQueue.progressLabel} tone="info" />
              </View>
              <Text numberOfLines={2} style={styles.cardBody}>{mistakeQueue.body}</Text>
              {mistakeQueue.items.length > 0 ? (
                <View style={styles.queueList}>
                  {visibleMistakeQueueItems.map((mistake) => (
                    <View key={mistake.id} style={styles.queueItem}>
                      <View style={styles.rowBetween}>
                        <Badge
                          label={mistake.category}
                          tone={mistake.isPracticed ? 'success' : 'secondary'}
                        />
                        <Badge
                          label={mistake.statusLabel}
                          tone={mistake.isPracticed ? 'success' : 'info'}
                        />
                      </View>
                      <Text numberOfLines={2} style={styles.queueCorrection}>
                        {mistake.correction}
                      </Text>
                    </View>
                  ))}
                  {hiddenMistakeQueueCount > 0 ? (
                    <Text style={styles.queueMoreLabel}>
                      {hiddenMistakeQueueCount} hidden until you need them
                    </Text>
                  ) : null}
                  {mistakeQueue.items.length > 1 ? (
                    <View style={styles.queueToggleAction}>
                      <AppButton
                        accessibilityHint={isMistakeQueueOpen
                          ? 'Hide the extra queued mistakes'
                          : 'Show the full queued mistake bank'}
                        label={isMistakeQueueOpen ? 'Hide list' : `Show all ${mistakeQueue.items.length}`}
                        onPress={() => setIsMistakeQueueOpen((isOpen) => !isOpen)}
                        size="small"
                        variant="quiet"
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}
            </Card>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statStrip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    width: 1,
  },
  statValue: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexOne: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cardKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  cardTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  cardBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  progressWrap: {
    marginTop: spacing.lg,
  },
  guideSteps: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  guideStepRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  guideStepIndex: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 28,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 28,
  },
  guideStepIndexText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  guideStepText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  cardAction: {
    marginTop: spacing.lg,
  },
  metaLine: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  nextFocusBox: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  nextFocusLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  nextFocusText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  sessionPreview: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  sessionFeedback: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  latestFocusBox: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  latestFocusLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  latestFocusText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  latestAnswerBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  latestAnswerLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  latestAnswerText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  unlockLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
  lockedPreview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  previewTotal: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  previewLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  previewCorrection: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  previewNote: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  queueCorrection: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  queueItem: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  queueList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  queueMoreLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    textAlign: 'center',
  },
  queueToggleAction: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  mistakeCorrection: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  mistakeLabelStrong: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  practiceStatusBox: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  practiceStatusBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  practiceStatusAction: {
    marginTop: spacing.md,
  },
  skillGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  weekCard: {
    padding: spacing.md,
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xs,
    height: 74,
    marginTop: spacing.md,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    minHeight: 12,
    opacity: 0.76,
    width: '100%',
  },
  chartLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
});
