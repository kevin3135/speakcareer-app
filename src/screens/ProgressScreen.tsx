import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  MistakeCard,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  SkillProgressCard,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createLocalProgressStats } from '../utils/localProgress';
import { createMistakePracticeDrill, createMistakePracticeStatus } from '../utils/mistakePracticeDrill';
import { createProgressEmptyState } from '../utils/progressEmptyState';
import { createProgressMistakeBankPreview } from '../utils/progressMistakeBankPreview';
import { createProgressNextStepGuide } from '../utils/progressNextStep';
import { formatSessionDate } from '../utils/sessionHistory';

type ProgressScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onMarkMistakePracticed: (mistakeId: string) => void;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
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
  const { summary, mistakeBank } = progressData;
  const mission = createDailyMission(summary, sessions, dailyTarget);
  const localProgress = createLocalProgressStats(summary, sessions, dailyTarget);
  const totalXp = mission.xpTotal;
  const latestSession = sessions[0];
  const isFirstSaveLocked = sessions.length === 0;
  const mistakesFixed = sessions.length > 0 ? Math.min(mistakeBank.length, sessions.length + 1) : 0;
  const nextStepGuide = createProgressNextStepGuide({
    dailyTarget,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const emptyState = isFirstSaveLocked ? createProgressEmptyState() : null;
  const mistakePreview = isFirstSaveLocked ? createProgressMistakeBankPreview(mistakeBank) : null;
  const mistakeDrill = isFirstSaveLocked ? null : createMistakePracticeDrill(mistakeBank);
  const isTopMistakePracticed = mistakeDrill
    ? practicedMistakeIds.includes(mistakeDrill.mistake.id)
    : false;
  const mistakePracticeStatus = mistakeDrill
    ? createMistakePracticeStatus(isTopMistakePracticed)
    : null;

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
          <XPBadge label={mission.rewardLabel} />
        </View>
        <Text style={styles.cardBody}>{nextStepGuide.body}</Text>
        <View style={styles.guideSteps}>
          {nextStepGuide.steps.map((step, index) => (
            <View key={step} style={styles.guideStepRow}>
              <View style={styles.guideStepIndex}>
                <Text style={styles.guideStepIndexText}>{index + 1}</Text>
              </View>
              <Text style={styles.guideStepText}>{step}</Text>
            </View>
          ))}
        </View>
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
          <View style={styles.statGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.minutesPracticed}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{localProgress.sessionsCompleted}</Text>
              <Text style={styles.statLabel}>Roleplays</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{mistakesFixed}</Text>
              <Text style={styles.statLabel}>Fixes</Text>
            </Card>
          </View>

          {latestSession ? (
            <Card>
              <Text style={styles.cardKicker}>Latest win</Text>
              <Text style={styles.cardTitle}>{latestSession.roleplayTitle}</Text>
              <Text style={styles.metaLine}>
                {formatSessionDate(latestSession.completedAt)} - {latestSession.wordCount} words - +{latestSession.xpReward} XP
              </Text>
              <Text style={styles.sessionPreview}>{latestSession.answerPreview}</Text>
              <Text style={styles.sessionFeedback}>{latestSession.feedbackSummary}</Text>
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

          <Card>
            <Text style={styles.cardKicker}>Weekly activity</Text>
            <Text style={styles.cardTitle}>Practice rhythm</Text>
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
                  onPress={() => onOpenRoleplay(mistakeDrill.roleplayId)}
                />
              </View>
            </Card>
          ) : null}

          <SectionHeader
            subtitle="Fix one pattern, then use it again in roleplay."
            title="Mistake bank"
          />
          {mistakeBank.map((mistake, index) => (
            <MistakeCard
              category={mistake.category}
              correction={mistake.correction}
              explanation={mistake.note}
              key={mistake.id}
              onPractice={() => onOpenRoleplay(index === 1 ? 'meeting-practice' : 'job-interview')}
              original={mistake.original}
              repeatedCount={index + 1}
            />
          ))}
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
  statGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
  },
  statValue: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
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
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    height: 104,
    marginTop: spacing.lg,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    minHeight: 16,
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
