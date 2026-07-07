import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  LevelBadge,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  SkillProgressCard,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { foundationStart, guidedStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayWarmupCue } from '../types';
import { FOUNDATION_TOTAL_STEPS } from '../utils/foundationProgressStorage';
import { createFirstWinReturnCue } from '../utils/firstWinReturnCue';
import { createDailyMission } from '../utils/gamification';
import { createLevelProgress } from '../utils/levelProgress';
import { createLocalProgressStats } from '../utils/localProgress';
import { createMistakePracticeDrill, createMistakePracticeStatus } from '../utils/mistakePracticeDrill';
import { createProgressEmptyState } from '../utils/progressEmptyState';
import { createProgressLevelRunway } from '../utils/progressLevelRunway';
import {
  createProgressLatestWinState,
  createProgressSpeakingFocusCue,
} from '../utils/progressLatestWin';
import { createProgressMistakeBankQueue } from '../utils/progressMistakeBankQueue';
import { createProgressMistakeBankPreview } from '../utils/progressMistakeBankPreview';
import {
  createProgressMomentumUnlock,
  DETAILED_PROGRESS_UNLOCK_TARGET,
} from '../utils/progressMomentumUnlock';
import { createProgressNextStepGuide } from '../utils/progressNextStep';
import { createProgressRecentSessions } from '../utils/progressRecentSessions';
import { createRoleplayWarmupCue } from '../utils/roleplayWarmupCue';
import { formatSessionDate } from '../utils/sessionHistory';

type ProgressScreenProps = {
  dailyTarget: DailyPracticeTarget;
  foundationCompletedSteps: number;
  onMarkMistakePracticed: (mistakeId: string) => void;
  onOpenRoleplay: (roleplayId: RoleplayId, warmupCue?: RoleplayWarmupCue) => void;
  onStartFoundation: () => void;
  practicedMistakeIds: string[];
  sessions: PracticeSession[];
};

const weekActivity = [28, 44, 18, 65, 40, 72, 55];

export function ProgressScreen({
  dailyTarget,
  foundationCompletedSteps,
  onMarkMistakePracticed,
  onOpenRoleplay,
  onStartFoundation,
  practicedMistakeIds,
  sessions,
}: ProgressScreenProps) {
  const [isMistakeQueueOpen, setIsMistakeQueueOpen] = useState(false);
  const { summary, mistakeBank } = progressData;
  const mission = createDailyMission(summary, sessions, dailyTarget);
  const localProgress = createLocalProgressStats(summary, sessions, dailyTarget);
  const totalXp = mission.xpTotal;
  const levelProgress = createLevelProgress(localProgress.totalCareerXp);
  const levelRunway = createProgressLevelRunway({
    dailyTarget,
    levelProgress,
    targetSessionsCompleted: localProgress.targetSessionsCompleted,
    targetSessionsRemaining: localProgress.targetSessionsRemaining,
  });
  const latestSession = sessions[0];
  const latestSessionFocusText = latestSession?.nextFocusText?.trim() ?? '';
  const recentSessions = createProgressRecentSessions(sessions);
  const isFirstSaveLocked = sessions.length === 0;
  const isDailyTargetComplete =
    !isFirstSaveLocked && localProgress.targetSessionsRemaining === 0;
  const latestWin = latestSession
    ? createProgressLatestWinState({
      isDailyTargetComplete,
      session: latestSession,
    })
    : null;
  const speakingFocusCue = latestSession
    ? createProgressSpeakingFocusCue({
      isDailyTargetComplete,
      session: latestSession,
    })
    : null;
  const mistakesFixed = sessions.length > 0 ? Math.min(mistakeBank.length, sessions.length + 1) : 0;
  const nextStepGuide = createProgressNextStepGuide({
    dailyTarget,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const firstWinReturnCue = sessions.length === 1
    ? createFirstWinReturnCue({
      ctaLabel: nextStepGuide.ctaLabel,
      isDailyTargetComplete,
      streakDays: mission.streakDays,
    })
    : null;
  const primaryGuideStep = nextStepGuide.steps[0];
  const hasCompletedFoundation = foundationCompletedSteps >= FOUNDATION_TOTAL_STEPS;
  const emptyState = isFirstSaveLocked
    ? createProgressEmptyState({
      foundationTitle: foundationStart.title,
      hasCompletedFoundation,
      nextRoleplayTitle: guidedStart.title,
    })
    : null;
  const progressMomentumUnlock = isFirstSaveLocked
    ? null
    : createProgressMomentumUnlock(sessions.length);
  const hasDetailedProgressUnlocked = sessions.length >= DETAILED_PROGRESS_UNLOCK_TARGET;
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
  const visibleMistakeQueueItems = mistakeQueue && isMistakeQueueOpen
    ? mistakeQueue.items
    : [];
  const hiddenMistakeQueueCount = mistakeQueue
    ? Math.max(0, mistakeQueue.items.length - visibleMistakeQueueItems.length)
    : 0;
  const levelRunwayBody = isDailyTargetComplete
    ? 'Review first. Bonus XP can wait.'
    : levelRunway.body;
  const latestWinCard = latestSession && latestWin ? (
    <Card>
      <View style={styles.rowBetween}>
        <Text style={styles.cardKicker}>{latestWin.eyebrow}</Text>
        <Badge
          label={latestWin.badgeLabel}
          tone={latestSession.includedFollowUp || isDailyTargetComplete ? 'success' : 'accent'}
        />
      </View>
      <Text style={styles.cardTitle}>{latestSession.roleplayTitle}</Text>
      <Text style={styles.cardBody}>{latestWin.body}</Text>
      <View style={styles.latestWinRewardPanel}>
        {latestWin.rewardRows.map((row) => (
          <View key={row.label} style={styles.latestWinRewardRow}>
            <Text style={styles.latestWinRewardLabel}>{row.label}</Text>
            <Text style={styles.latestWinRewardValue}>{row.value}</Text>
          </View>
        ))}
        <Text style={styles.latestWinSavedNote}>
          Saved {formatSessionDate(latestSession.completedAt)}
        </Text>
      </View>
      <View style={styles.latestWinRecapBox}>
        <Text style={styles.latestWinRecapLabel}>{latestWin.recapLabel}</Text>
        <Text style={styles.latestWinRecapText}>{latestWin.recapText}</Text>
      </View>
      <View style={styles.latestFocusBox}>
        <View style={styles.rowBetween}>
          <Text style={styles.latestFocusLabel}>{latestWin.coachLabel}</Text>
          <Badge
            label={latestWin.coachBadgeLabel}
            tone={latestSessionFocusText ? 'accent' : 'secondary'}
          />
        </View>
        <Text style={styles.latestFocusText}>{latestWin.coachText}</Text>
      </View>
      <View style={styles.latestAnswerBox}>
        <Text style={styles.latestAnswerLabel}>Saved answer</Text>
        <Text numberOfLines={2} style={styles.latestAnswerText}>
          {latestSession.answerPreview}
        </Text>
      </View>
      {firstWinReturnCue ? (
        <View style={styles.firstWinReturnBox}>
          <View style={styles.rowBetween}>
            <Text style={styles.firstWinReturnLabel}>{firstWinReturnCue.label}</Text>
            <Badge label={firstWinReturnCue.badgeLabel} tone="info" />
          </View>
          <Text style={styles.firstWinReturnTitle}>{firstWinReturnCue.title}</Text>
          <Text style={styles.firstWinReturnBody}>{firstWinReturnCue.body}</Text>
        </View>
      ) : null}
      <View style={styles.cardAction}>
        <AppButton
          label="Practice this scenario again"
          onPress={() => onOpenRoleplay(latestSession.roleplayId)}
          variant="secondary"
        />
      </View>
    </Card>
  ) : null;
  const levelRunwayCard = (
    <Card tone="muted">
      <View style={styles.rowBetween}>
        <View style={styles.flexOne}>
          <Text style={styles.cardKicker}>Level runway</Text>
          <Text style={styles.cardTitle}>{levelRunway.title}</Text>
        </View>
        <LevelBadge label={levelRunway.badgeLabel} />
      </View>
      <Text
        numberOfLines={isDailyTargetComplete ? 1 : undefined}
        style={[
          styles.cardBody,
          isDailyTargetComplete && styles.levelRunwayBodyComplete,
        ]}
      >
        {levelRunwayBody}
      </Text>
      <View style={styles.levelRunwayMeta}>
        <Text style={styles.levelRunwayMetaLabel}>{levelRunway.targetLabel}</Text>
        <Text style={styles.levelRunwayMetaValue}>{levelRunway.totalXpLabel}</Text>
      </View>
      <View style={styles.progressWrap}>
        <ProgressBar
          label={levelRunway.progressLabel}
          tone="purple"
          value={levelRunway.progressPercent}
        />
      </View>
    </Card>
  );

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

      <Card tone={isDailyTargetComplete ? 'accent' : 'strong'}>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.cardKicker}>{nextStepGuide.eyebrow}</Text>
            <Text style={styles.cardTitle}>{nextStepGuide.title}</Text>
          </View>
          <Badge label={nextStepGuide.statusLabel} tone={nextStepGuide.statusTone} />
        </View>
        <Text numberOfLines={2} style={styles.cardBody}>{nextStepGuide.body}</Text>
        {primaryGuideStep ? (
          <View
            style={[
              styles.nextFocusBox,
              isDailyTargetComplete && styles.nextFocusBoxComplete,
            ]}
          >
            <View style={styles.nextFocusHeader}>
              {isDailyTargetComplete ? (
                <View style={styles.nextFocusIcon}>
                  <Text style={styles.nextFocusIconText}>OK</Text>
                </View>
              ) : null}
              <View style={styles.nextFocusCopy}>
                <Text style={[
                  styles.nextFocusLabel,
                  isDailyTargetComplete && styles.nextFocusLabelComplete,
                ]}>
                  {isDailyTargetComplete ? 'Today complete' : 'Do now'}
                </Text>
                <Text numberOfLines={2} style={styles.nextFocusText}>{primaryGuideStep}</Text>
              </View>
            </View>
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
            accessibilityHint="Open the recommended next roleplay from your progress card"
            label={nextStepGuide.ctaLabel}
            onPress={() => onOpenRoleplay(nextStepGuide.roleplayId)}
            variant={isDailyTargetComplete ? 'secondary' : 'primary'}
          />
        </View>
      </Card>

      {speakingFocusCue ? (
        <Card style={styles.speakingFocusCard} tone="muted">
          <View style={styles.speakingFocusRow}>
            <View style={styles.speakingFocusAvatar}>
              <Text style={styles.speakingFocusAvatarText}>AI</Text>
            </View>
            <View style={styles.speakingFocusCopy}>
              <View style={styles.speakingFocusHeader}>
                <Text style={styles.speakingFocusLabel}>{speakingFocusCue.eyebrow}</Text>
                <Badge label={speakingFocusCue.badgeLabel} tone="purple" />
              </View>
              <Text numberOfLines={2} style={styles.speakingFocusText}>
                {speakingFocusCue.text}
              </Text>
              <Text style={styles.speakingFocusMeta}>{speakingFocusCue.metaText}</Text>
            </View>
          </View>
        </Card>
      ) : null}

      {isDailyTargetComplete ? latestWinCard : null}
      {levelRunwayCard}

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
              <View style={styles.emptyStateActionBox}>
                <Text style={styles.emptyStateActionLabel}>Next guided step</Text>
                <Text style={styles.emptyStateActionTitle}>{emptyState.action.title}</Text>
                <Text style={styles.emptyStateActionBody}>{emptyState.action.body}</Text>
              </View>
              <View style={styles.cardAction}>
                <AppButton
                  accessibilityHint={emptyState.action.target === 'foundation'
                    ? 'Open the current guided foundation lesson from Wins'
                    : 'Open the first guided interview roleplay from Wins'}
                  label={emptyState.action.ctaLabel}
                  onPress={() => {
                    if (emptyState.action.target === 'foundation') {
                      onStartFoundation();
                      return;
                    }

                    onOpenRoleplay(guidedStart.roleplayId);
                  }}
                />
              </View>
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
          {hasDetailedProgressUnlocked ? (
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
          ) : null}

          {!isDailyTargetComplete ? latestWinCard : null}

          {progressMomentumUnlock ? (
            <Card tone="muted">
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.cardKicker}>{progressMomentumUnlock.eyebrow}</Text>
                  <Text style={styles.cardTitle}>{progressMomentumUnlock.title}</Text>
                </View>
                <Badge label={progressMomentumUnlock.progressLabel} tone="info" />
              </View>
              <Text style={styles.cardBody}>{progressMomentumUnlock.body}</Text>
              <View style={styles.progressWrap}>
                <ProgressBar
                  label={progressMomentumUnlock.progressLabel}
                  tone="secondary"
                  value={progressMomentumUnlock.progressPercent}
                />
              </View>
              <View style={styles.unlockList}>
                {progressMomentumUnlock.items.map((item, index) => (
                  <View key={item} style={styles.unlockListRow}>
                    <View style={styles.unlockListIndex}>
                      <Text style={styles.unlockListIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.unlockListText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}

          {recentSessions ? (
            <Card tone="muted">
              <View style={styles.rowBetween}>
                <View style={styles.flexOne}>
                  <Text style={styles.cardKicker}>{recentSessions.eyebrow}</Text>
                  <Text style={styles.cardTitle}>{recentSessions.title}</Text>
                </View>
                <Badge label={recentSessions.countLabel} tone="info" />
              </View>
              <Text style={styles.cardBody}>{recentSessions.body}</Text>
              <View style={styles.recentSessionsList}>
                {recentSessions.items.map((session) => (
                  <View key={session.id} style={styles.recentSessionItem}>
                    <View style={styles.rowBetween}>
                      <View style={styles.flexOne}>
                        <Text numberOfLines={1} style={styles.recentSessionTitle}>
                          {session.roleplayTitle}
                        </Text>
                        <Text style={styles.recentSessionMeta}>{session.metaLabel}</Text>
                      </View>
                      <XPBadge label={session.xpLabel} />
                    </View>
                    <View style={styles.recentSessionFocusBox}>
                      <Text style={styles.recentSessionFocusLabel}>{session.nextFocusLabel}</Text>
                      <Text numberOfLines={2} style={styles.recentSessionFocusText}>
                        {session.nextFocusText}
                      </Text>
                    </View>
                    <View style={styles.recentSessionAction}>
                      <AppButton
                        accessibilityHint={`Open ${session.roleplayTitle} again from your earlier wins`}
                        label={session.replayLabel}
                        onPress={() => onOpenRoleplay(session.roleplayId)}
                        size="small"
                        variant="quiet"
                      />
                    </View>
                  </View>
                ))}
                {recentSessions.footerLabel ? (
                  <Text style={styles.recentSessionsFooter}>{recentSessions.footerLabel}</Text>
                ) : null}
              </View>
            </Card>
          ) : null}

          {hasDetailedProgressUnlocked ? (
            <>
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
            </>
          ) : null}

          {mistakeDrill ? (
            <Card style={styles.mistakeDrillCard} tone="accent">
              <View style={styles.mistakeDrillHeader}>
                <View style={styles.mistakeDrillIcon}>
                  <Text style={styles.mistakeDrillIconText}>FIX</Text>
                </View>
                <View style={styles.mistakeDrillHeaderCopy}>
                  <Text style={styles.mistakeDrillEyebrow}>{mistakeDrill.eyebrow}</Text>
                  <Text numberOfLines={1} style={styles.mistakeDrillTitle}>
                    {mistakeDrill.title}
                  </Text>
                </View>
                <Badge label={mistakeDrill.mistake.priority} tone="accent" />
              </View>
              <Text numberOfLines={2} style={styles.mistakeDrillBody}>{mistakeDrill.body}</Text>
              <View style={styles.mistakeCorrectionHero}>
                <Text style={styles.mistakeCorrectionLabel}>{mistakeDrill.correctionLabel}</Text>
                <Text style={styles.mistakeCorrectionText}>{mistakeDrill.mistake.correction}</Text>
              </View>
              {mistakePracticeStatus ? (
                <View style={styles.mistakeRepeatBox}>
                  <View style={styles.mistakeRepeatNumber}>
                    <Text style={styles.mistakeRepeatNumberText}>1</Text>
                  </View>
                  <View style={styles.mistakeRepeatCopy}>
                    <View style={styles.mistakeRepeatHeader}>
                      <Text style={styles.mistakeRepeatLabel}>{mistakePracticeStatus.label}</Text>
                      <Badge
                        label={isTopMistakePracticed ? 'Saved locally' : mistakeDrill.repeatBadgeLabel}
                        tone={isTopMistakePracticed ? 'success' : 'info'}
                      />
                    </View>
                    <Text style={styles.mistakeRepeatInstruction}>
                      {isTopMistakePracticed
                        ? mistakePracticeStatus.body
                        : mistakeDrill.repeatInstruction}
                    </Text>
                  </View>
                </View>
              ) : null}
              {mistakePracticeStatus ? (
                <View style={styles.practiceStatusAction}>
                  <AppButton
                    disabled={isTopMistakePracticed}
                    label={mistakePracticeStatus.ctaLabel}
                    onPress={() => onMarkMistakePracticed(mistakeDrill.mistake.id)}
                    size="small"
                    variant={isTopMistakePracticed ? 'quiet' : 'secondary'}
                  />
                  {isTopMistakePracticed ? null : (
                    <Text style={styles.practiceStatusHint}>{mistakePracticeStatus.body}</Text>
                  )}
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

          {hasDetailedProgressUnlocked ? (
            <>
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
                    <Badge
                      label={mistakeQueue.progressLabel}
                      tone="info"
                    />
                  </View>
                  <Text numberOfLines={2} style={styles.cardBody}>{mistakeQueue.body}</Text>
                  {mistakeQueue.items.length > 0 ? (
                    <View style={styles.queueList}>
                      {hiddenMistakeQueueCount > 0 ? (
                        <View style={styles.queueCollapsedCue}>
                          <View style={styles.queueCollapsedIcon}>
                            <Text style={styles.queueCollapsedIconText}>Q</Text>
                          </View>
                          <View style={styles.flexOne}>
                            <Text style={styles.queueMoreLabel}>
                              {hiddenMistakeQueueCount} saved for later
                            </Text>
                            <Text numberOfLines={1} style={styles.queueMoreHint}>
                              Open only when you want the full queue.
                            </Text>
                          </View>
                        </View>
                      ) : null}
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
                      {mistakeQueue.items.length > 0 ? (
                        <View style={styles.queueToggleAction}>
                          <AppButton
                            accessibilityHint={isMistakeQueueOpen
                              ? 'Hide the extra queued mistakes'
                              : 'Show the full queued mistake bank'}
                            label={isMistakeQueueOpen ? 'Hide list' : 'See all mistakes'}
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
  speakingFocusCard: {
    backgroundColor: colors.coachSoft,
    borderColor: colors.coach,
    padding: spacing.lg,
  },
  speakingFocusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  speakingFocusAvatar: {
    alignItems: 'center',
    backgroundColor: colors.coach,
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  speakingFocusAvatarText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  speakingFocusCopy: {
    flex: 1,
    minWidth: 0,
  },
  speakingFocusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  speakingFocusLabel: {
    color: colors.coach,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  speakingFocusText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  speakingFocusMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  progressWrap: {
    marginTop: spacing.lg,
  },
  unlockList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  unlockListIndex: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  unlockListIndexText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  unlockListRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unlockListText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
  },
  levelRunwayMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  levelRunwayBodyComplete: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  levelRunwayMetaLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  levelRunwayMetaValue: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  cardAction: {
    marginTop: spacing.lg,
  },
  latestWinRewardPanel: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  latestWinRewardRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  latestWinRewardLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    minWidth: 58,
  },
  latestWinRewardValue: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    textAlign: 'right',
  },
  latestWinSavedNote: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '800',
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  latestWinRecapBox: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  latestWinRecapLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  latestWinRecapText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
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
  nextFocusBoxComplete: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  nextFocusCopy: {
    flex: 1,
    minWidth: 0,
  },
  nextFocusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  nextFocusIcon: {
    alignItems: 'center',
    backgroundColor: colors.success,
    borderColor: colors.successDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  nextFocusIconText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  nextFocusLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  nextFocusLabelComplete: {
    color: colors.successDark,
  },
  nextFocusText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
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
  firstWinReturnBox: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  firstWinReturnLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  firstWinReturnTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  firstWinReturnBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  recentSessionsList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  recentSessionItem: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  recentSessionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  recentSessionMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  recentSessionFocusBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  recentSessionFocusLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  recentSessionFocusText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  recentSessionAction: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  recentSessionsFooter: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    textAlign: 'center',
  },
  unlockLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
  emptyStateActionBox: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  emptyStateActionLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  emptyStateActionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  emptyStateActionBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
  queueCollapsedCue: {
    alignItems: 'center',
    backgroundColor: colors.correctionSoft,
    borderColor: colors.correction,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  queueCollapsedIcon: {
    alignItems: 'center',
    backgroundColor: colors.correction,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  queueCollapsedIconText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  queueList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  queueMoreLabel: {
    color: colors.correction,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  queueMoreHint: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  queueToggleAction: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  mistakeDrillCard: {
    borderColor: colors.accent,
  },
  mistakeDrillHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  mistakeDrillIcon: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  mistakeDrillIconText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  mistakeDrillHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  mistakeDrillEyebrow: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeDrillTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  mistakeDrillBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
  mistakeCorrectionHero: {
    backgroundColor: colors.correctionSoft,
    borderColor: colors.correction,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  mistakeCorrectionLabel: {
    color: colors.correction,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeCorrectionText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  mistakeRepeatBox: {
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  mistakeRepeatNumber: {
    alignItems: 'center',
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  mistakeRepeatNumberText: {
    color: colors.infoDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeRepeatCopy: {
    flex: 1,
    minWidth: 0,
  },
  mistakeRepeatHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  mistakeRepeatLabel: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeRepeatInstruction: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  practiceStatusAction: {
    alignItems: 'flex-start',
    marginTop: spacing.md,
  },
  practiceStatusHint: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
