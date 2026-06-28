import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  ProgressBar,
  ScreenContainer,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { guidedStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type {
  DailyPracticeTarget,
  PracticeSession,
  RoleplayId,
  RoleplayScenario,
  RoleplayWarmupCue,
  StartingLevelId,
} from '../types';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createFeedbackScoreSummary } from '../utils/feedbackScoreSummary';
import { createFeedbackSnapshot } from '../utils/feedbackSnapshot';
import { createAdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { createDailyMission } from '../utils/gamification';
import { createLevelProgress } from '../utils/levelProgress';
import {
  createPracticeCompletionSummary,
  createPracticeSavePrompt,
  createSavedRoleplayMilestone,
  createSavedRoleplayHandoff,
  createSavedRoleplayPathProgress,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createPracticeSession } from '../utils/sessionHistory';
import { getStartingLevelProfile } from '../utils/startingLevel';
import { createRoleplayFirstQuestState } from '../utils/roleplayFirstQuest';
import { createRoleplayStarterReminder } from '../utils/roleplayStarterReminder';

type RoleplayScreenProps = {
  dailyTarget: DailyPracticeTarget;
  roleplay: RoleplayScenario;
  onBack: () => void;
  onOpenProgress: () => void;
  onSelectRoleplay: (roleplayId: RoleplayId) => void;
  onSaveSession: (session: PracticeSession) => void;
  sessions: PracticeSession[];
  startingLevelId: StartingLevelId;
  warmupCue?: RoleplayWarmupCue | null;
};

const FOLLOW_UP_BONUS_XP = 15;

type LevelUpMoment = {
  currentLevelLabel: string;
  previousLevelLabel: string;
  totalXpLabel: string;
};

export function RoleplayScreen({
  dailyTarget,
  onBack,
  onOpenProgress,
  onSaveSession,
  roleplay,
  onSelectRoleplay,
  sessions,
  startingLevelId,
  warmupCue,
}: RoleplayScreenProps) {
  const answerInputRef = useRef<TextInput>(null);
  const followUpInputRef = useRef<TextInput>(null);
  const [answerPulse] = useState(() => new Animated.Value(0));
  const [draftAnswer, setDraftAnswer] = useState('');
  const [answerReview, setAnswerReview] = useState<AnswerReview | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<RuleBasedFeedbackResult | null>(null);
  const [savedSession, setSavedSession] = useState<PracticeSession | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [hasAppliedBetterEnglish, setHasAppliedBetterEnglish] = useState(false);
  const [isFeedbackDetailsOpen, setIsFeedbackDetailsOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isAnswerFocused, setIsAnswerFocused] = useState(false);
  const [levelUpMoment, setLevelUpMoment] = useState<LevelUpMoment | null>(null);

  const activeVariant = roleplay.promptVariants?.[0];
  const openingLine = activeVariant?.openingLine ?? roleplay.openingLine;
  const baseXpReward = feedbackResult?.xpReward ?? roleplay.durationMinutes * 4;
  const followUpReview = followUpAnswer.trim().length > 0
    ? summarizePracticeAnswer(followUpAnswer)
    : null;
  const includedFollowUp = Boolean(followUpReview?.isReadyForFeedback);
  const totalXpReward = baseXpReward + (includedFollowUp ? FOLLOW_UP_BONUS_XP : 0);
  const savedPathProgress = savedSession
    ? createSavedRoleplayPathProgress({
      roleplays: practiceContent.roleplays,
      savedSession,
      sessions,
    })
    : null;
  const savedHandoff = createSavedRoleplayHandoff({
    isPathComplete: savedPathProgress?.isPathComplete,
    nextPracticeTitle: savedPathProgress?.nextTitle ?? null,
    xpReward: savedSession?.xpReward ?? totalXpReward,
  });
  const savedSummary = savedSession
    ? createPracticeCompletionSummary({
      includedFollowUp: savedSession.includedFollowUp,
      roleplayTitle: savedSession.roleplayTitle,
      xpReward: savedSession.xpReward,
    })
    : null;
  const savedMilestone = savedSession
    ? createSavedRoleplayMilestone({
      dailyTarget,
      savedSession,
      sessions,
      summary: progressData.summary,
    })
    : null;
  const levelProfile = getStartingLevelProfile(startingLevelId);
  const starterReminder = createRoleplayStarterReminder({
    roleplayId: roleplay.id,
    sessions,
    starterAnswer: levelProfile.starterAnswer,
  });
  const firstQuestState = createRoleplayFirstQuestState({
    guidedStart,
    roleplayId: roleplay.id,
    sessions,
  });
  const visibleFirstQuestState = warmupCue ? null : firstQuestState;
  const isReviewStep = Boolean(feedbackResult);
  const hasDraftAnswer = draftAnswer.trim().length > 0;
  const shouldPulseAnswer = !isReviewStep && !hasDraftAnswer && !isAnswerFocused;
  const feedbackScoreSummary = feedbackResult
    ? createFeedbackScoreSummary(feedbackResult.feedback.scores)
    : null;
  const feedbackSnapshot = feedbackResult && feedbackScoreSummary
    ? createFeedbackSnapshot({
      answer: draftAnswer,
      improvements: feedbackResult.feedback.improvements,
      summary: feedbackScoreSummary,
    })
    : null;
  const followUpPrompt = answerReview?.isReadyForFeedback
    ? createAdaptiveFollowUpPrompt(roleplay, draftAnswer, answerReview)
    : null;
  const savePrompt = answerReview?.isReadyForFeedback
    ? createPracticeSavePrompt({
      includedFollowUp,
      xpReward: totalXpReward,
    })
    : null;
  const isFollowUpExpanded = isFollowUpOpen || includedFollowUp;
  const answerPulseStyle = {
    opacity: answerPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.16, 0.46],
    }),
    transform: [
      {
        scale: answerPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.99, 1.035],
        }),
      },
    ],
  };

  useEffect(() => {
    if (!shouldPulseAnswer) {
      answerPulse.stopAnimation(() => answerPulse.setValue(0));
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(answerPulse, {
          duration: 900,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(answerPulse, {
          duration: 900,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => pulse.stop();
  }, [answerPulse, shouldPulseAnswer]);

  useEffect(() => {
    if (!isFollowUpOpen) {
      return;
    }

    followUpInputRef.current?.focus();
  }, [isFollowUpOpen]);

  function reviewAnswer() {
    const review = summarizePracticeAnswer(draftAnswer);
    const nextFeedback = createRuleBasedFeedback(roleplay, draftAnswer, review, activeVariant);

    setAnswerReview(review);
    setFeedbackResult(nextFeedback);
    setFollowUpAnswer('');
    setIsFeedbackDetailsOpen(false);
    setIsFollowUpOpen(false);
    setSavedSession(null);
    setLevelUpMoment(null);
  }

  function retryAnswer() {
    setFeedbackResult(null);
    setAnswerReview(null);
    setFollowUpAnswer('');
    setHasAppliedBetterEnglish(false);
    setIsFeedbackDetailsOpen(false);
    setIsFollowUpOpen(false);
    setSavedSession(null);
    setLevelUpMoment(null);
    answerInputRef.current?.focus();
  }

  function useBetterEnglishAnswer() {
    if (!feedbackResult) {
      return;
    }

    setDraftAnswer(feedbackResult.feedback.suggestedRewrite);
    setFeedbackResult(null);
    setAnswerReview(null);
    setFollowUpAnswer('');
    setHasAppliedBetterEnglish(true);
    setIsFeedbackDetailsOpen(false);
    setIsFollowUpOpen(false);
    setSavedSession(null);
    setLevelUpMoment(null);
  }

  function saveSession() {
    if (!answerReview?.isReadyForFeedback || !feedbackResult) {
      return;
    }

    const session = createPracticeSession({
      answer: draftAnswer,
      followUpAnswer,
      includedFollowUp,
      feedback: feedbackResult.feedback,
      review: answerReview,
      roleplay,
      xpReward: totalXpReward,
    });

    setLevelUpMoment(createSavedLevelUpMoment(session));
    setSavedSession(session);
    onSaveSession(session);
  }

  function createSavedLevelUpMoment(session: PracticeSession): LevelUpMoment | null {
    const previousMission = createDailyMission(progressData.summary, sessions, dailyTarget);
    const nextMission = createDailyMission(progressData.summary, [session, ...sessions], dailyTarget);
    const previousLevel = createLevelProgress(previousMission.xpTotal);
    const nextLevel = createLevelProgress(nextMission.xpTotal);

    if (previousLevel.currentLevelLabel === nextLevel.currentLevelLabel) {
      return null;
    }

    return {
      currentLevelLabel: nextLevel.currentLevelLabel,
      previousLevelLabel: previousLevel.currentLevelLabel,
      totalXpLabel: nextLevel.totalXpLabel,
    };
  }

  function continueToNext() {
    if (savedPathProgress) {
      onSelectRoleplay(savedPathProgress.roleplayId);
      return;
    }

    onOpenProgress();
  }

  function useStarterAnswer() {
    if (!starterReminder) {
      return;
    }

    setDraftAnswer(starterReminder.starterAnswer);
    setAnswerReview(null);
    setFeedbackResult(null);
    setHasAppliedBetterEnglish(false);
    setIsFeedbackDetailsOpen(false);
    setLevelUpMoment(null);
    answerInputRef.current?.focus();
  }

  function useWarmupStarter() {
    if (!warmupCue) {
      return;
    }

    setDraftAnswer(warmupCue.starterAnswer);
    setAnswerReview(null);
    setFeedbackResult(null);
    setHasAppliedBetterEnglish(false);
    setIsFeedbackDetailsOpen(false);
    setLevelUpMoment(null);
    answerInputRef.current?.focus();
  }

  function startFollowUpWithStarter() {
    if (!followUpPrompt) {
      return;
    }

    setFollowUpAnswer(followUpPrompt.starterAnswer);
    setIsFollowUpOpen(true);
  }

  if (savedSession) {
    return (
      <ScreenContainer>
        <Pressable
          accessibilityHint="Go back to Learn"
          accessibilityLabel="Back to Learn"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <GradientHero
          overline="Career win"
          subtitle={savedSummary?.body ?? savedHandoff.body}
          title={savedHandoff.title}
          tone="success"
        >
          <View style={styles.completeBadges}>
            <XPBadge label={savedHandoff.xpLabel} />
            {savedMilestone ? (
              <>
                <Badge
                  label={savedMilestone.title}
                  tone={savedMilestone.progressPercent === 100 ? 'success' : 'info'}
                />
                <Badge label={`Streak ${savedMilestone.streakValue}`} tone="secondary" />
              </>
            ) : (
              <Badge label="Streak updated" tone="accent" />
            )}
            {savedSession.includedFollowUp ? <Badge label="Follow-up saved" tone="secondary" /> : null}
          </View>
          {!savedPathProgress ? (
            <View style={styles.savedNextStep}>
              <Text style={styles.savedNextLabel}>{savedHandoff.nextLabel}</Text>
              <Text style={styles.savedNextTitle}>{savedHandoff.nextTitle}</Text>
            </View>
          ) : null}
          {savedPathProgress ? (
            <View style={styles.savedPathBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.savedPathLabel}>Career path</Text>
                <Badge label={savedPathProgress.badgeLabel} tone="accent" />
              </View>
              <Text style={styles.savedPathTitle}>{savedPathProgress.title}</Text>
              <Text style={styles.savedPathNext}>
                {savedPathProgress.nextLabel}: {savedPathProgress.nextTitle}
              </Text>
              <View style={styles.savedPathProgress}>
                <ProgressBar
                  label={savedPathProgress.progressLabel}
                  tone={savedPathProgress.isPathComplete ? 'success' : 'accent'}
                  value={savedPathProgress.progressPercent}
                />
              </View>
            </View>
          ) : null}
          {levelUpMoment ? (
            <View style={styles.levelUpBox}>
              <Text style={styles.levelUpLabel}>Level up</Text>
              <View style={styles.levelUpBadges}>
                <Badge label={levelUpMoment.currentLevelLabel} tone="accent" />
                <Badge label={levelUpMoment.totalXpLabel} tone="info" />
              </View>
              <Text style={styles.levelUpText}>
                You moved from {levelUpMoment.previousLevelLabel} to {levelUpMoment.currentLevelLabel}.
              </Text>
            </View>
          ) : null}
        </GradientHero>

        <AppButton label={savedHandoff.ctaLabel} onPress={continueToNext} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      overline={isReviewStep ? 'Step 2 of 3' : 'Step 1 of 3'}
      right={<XPBadge label={`+${roleplay.durationMinutes * 4} XP`} />}
      title={isReviewStep ? 'Better English' : 'Your turn'}
    >
      <Pressable
        accessibilityHint="Go back to Learn"
        accessibilityLabel="Back to Learn"
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {!feedbackResult ? (
        <Card tone="strong">
          {visibleFirstQuestState ? (
            <View style={styles.firstQuestCue}>
              <View style={styles.firstQuestNumber}>
                <Text style={styles.firstQuestNumberText}>1</Text>
              </View>
              <View style={styles.firstQuestCopy}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.firstQuestEyebrow}>{visibleFirstQuestState.eyebrow}</Text>
                  <Badge label={visibleFirstQuestState.progressLabel} tone="accent" />
                </View>
                <Text style={styles.firstQuestTitle}>{visibleFirstQuestState.title}</Text>
                <Text numberOfLines={2} style={styles.firstQuestText}>
                  {visibleFirstQuestState.body}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={styles.oneThingHeader}>
            <Text style={styles.cardKicker}>Question</Text>
            <Badge label="1 answer" tone="info" />
          </View>
          <Text style={styles.promptText}>{openingLine}</Text>
          {warmupCue ? (
            <View style={styles.warmupCueBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.warmupCueLabel}>{warmupCue.eyebrow}</Text>
                <Badge label={warmupCue.badgeLabel} tone="secondary" />
              </View>
              <Text style={styles.warmupCueText}>{warmupCue.correction}</Text>
              <Text style={styles.warmupCueNote}>{warmupCue.note}</Text>
              {!hasDraftAnswer ? (
                <View style={styles.warmupCueAction}>
                  <AppButton
                    accessibilityHint="Starts your answer with the suggested warm-up line"
                    accessibilityLabel={warmupCue.ctaLabel}
                    label={warmupCue.ctaLabel}
                    onPress={useWarmupStarter}
                    size="small"
                    variant="quiet"
                  />
                </View>
              ) : null}
            </View>
          ) : null}
          <View style={styles.answerInputShell}>
            {shouldPulseAnswer ? (
              <Animated.View
                pointerEvents="none"
                style={[styles.answerPulseRing, answerPulseStyle]}
              />
            ) : null}
            <TextInput
              accessibilityHint="Type your roleplay answer"
              accessibilityLabel="Roleplay answer"
              multiline
              onBlur={() => setIsAnswerFocused(false)}
              onChangeText={(answer) => {
                setDraftAnswer(answer);
                setAnswerReview(null);
                setFeedbackResult(null);
                setHasAppliedBetterEnglish(false);
                setIsFeedbackDetailsOpen(false);
                setLevelUpMoment(null);
              }}
              onFocus={() => setIsAnswerFocused(true)}
              placeholder={levelProfile.answerPlaceholder}
              placeholderTextColor={colors.textMuted}
              ref={answerInputRef}
              style={[styles.answerInput, (isAnswerFocused || hasDraftAnswer) && styles.answerInputActive]}
              textAlignVertical="top"
              value={draftAnswer}
            />
          </View>
          {starterReminder && !warmupCue && !hasDraftAnswer ? (
            <View style={styles.starterReminderRow}>
              <View style={styles.starterReminderCopy}>
                <Text style={styles.starterReminderLabel}>{starterReminder.eyebrow}</Text>
                <Text numberOfLines={1} style={styles.starterReminderNote}>
                  {starterReminder.body}
                </Text>
              </View>
              <View style={styles.starterReminderButton}>
                <AppButton
                  label={starterReminder.ctaLabel}
                  onPress={useStarterAnswer}
                  size="small"
                  variant="quiet"
                />
              </View>
            </View>
          ) : null}
          <View style={styles.answerAction}>
            <AppButton
              disabled={draftAnswer.trim().length === 0}
              label="Check answer"
              onPress={reviewAnswer}
            />
          </View>
        </Card>
      ) : null}

      {feedbackResult ? (
        <Card tone="strong">
          <View style={styles.oneThingHeader}>
            <View style={styles.feedbackHeroCopy}>
              <Text style={styles.cardKicker}>Coach says</Text>
              <Text style={styles.cardTitle}>{answerReview?.readinessLabel ?? 'Good start'}</Text>
            </View>
            <View style={styles.feedbackScoreWrap}>
              <View style={styles.feedbackScoreBadge}>
                <Text style={styles.feedbackScoreValue}>
                  {feedbackScoreSummary?.overallScore ?? 0}
                </Text>
                <Text style={styles.feedbackScoreLabel}>Score</Text>
              </View>
              <View style={styles.feedbackXpBadge}>
                <XPBadge label={`+${baseXpReward} XP`} />
              </View>
            </View>
          </View>
          {feedbackSnapshot ? null : (
            <Text style={styles.feedbackSummaryText}>{feedbackResult.feedback.summary}</Text>
          )}
          {feedbackSnapshot ? (
            <View style={styles.feedbackSnapshotBox}>
              <View style={styles.feedbackSnapshotHeader}>
                <Text style={styles.feedbackSnapshotLabel}>Next move</Text>
                <Badge label={feedbackSnapshot.nextFocusLabel} tone="accent" />
              </View>
              <Text style={styles.feedbackSnapshotText}>{feedbackSnapshot.nextMoveText}</Text>
              <View style={styles.feedbackSnapshotAnswerBox}>
                <Text style={styles.feedbackSnapshotAnswerLabel}>You said</Text>
                <Text numberOfLines={1} style={styles.feedbackSnapshotAnswerText}>
                  {feedbackSnapshot.answerPreview}
                </Text>
              </View>
            </View>
          ) : null}
          <Pressable
            accessibilityHint="Shows or hides score bars and detailed coach notes"
            accessibilityLabel={isFeedbackDetailsOpen ? 'Hide coach details' : 'Show coach details'}
            accessibilityRole="button"
            onPress={() => setIsFeedbackDetailsOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [styles.feedbackDetailsToggle, pressed && styles.pressed]}
          >
            <Text style={styles.feedbackDetailsToggleLabel}>
              {isFeedbackDetailsOpen ? 'Hide details' : 'Show details'}
            </Text>
            <Text style={styles.feedbackDetailsToggleMeta}>Scores and notes</Text>
          </Pressable>
          {isFeedbackDetailsOpen ? (
            <>
              <View style={styles.feedbackScores}>
                {feedbackResult.feedback.scores.map((score) => (
                  <View key={score.label} style={styles.feedbackScoreRow}>
                    <ProgressBar label={score.label} tone="primary" value={score.value} />
                  </View>
                ))}
              </View>
              <View style={styles.feedbackChecklist}>
                <View style={styles.feedbackChecklistBox}>
                  <Text style={styles.feedbackChecklistTitle}>Working well</Text>
                  {feedbackResult.feedback.strengths.map((strength) => (
                    <Text key={strength} style={styles.feedbackChecklistItem}>
                      - {strength}
                    </Text>
                  ))}
                </View>
                <View style={styles.feedbackChecklistBox}>
                  <Text style={styles.feedbackChecklistTitle}>Improve next</Text>
                  {feedbackResult.feedback.improvements.map((improvement) => (
                    <Text key={improvement} style={styles.feedbackChecklistItem}>
                      - {improvement}
                    </Text>
                  ))}
                </View>
              </View>
            </>
          ) : null}
          <View style={styles.betterEnglishBox}>
            <Text style={styles.betterEnglishLabel}>Better English</Text>
            <Text style={styles.betterEnglishText}>{feedbackResult.feedback.suggestedRewrite}</Text>
          </View>
          {answerReview?.isReadyForFeedback && hasAppliedBetterEnglish ? null : (
            <View style={styles.feedbackActions}>
              <View style={styles.feedbackActionItem}>
                <AppButton
                  accessibilityHint={
                    answerReview?.isReadyForFeedback
                      ? 'Moves the better English rewrite back into the answer box'
                      : 'Returns to the answer box so you can add more detail'
                  }
                  label={answerReview?.isReadyForFeedback ? 'Use better English' : 'Add more first'}
                  onPress={answerReview?.isReadyForFeedback ? useBetterEnglishAnswer : retryAnswer}
                  variant="secondary"
                />
              </View>
            </View>
          )}
        </Card>
      ) : null}

      {feedbackResult && answerReview?.isReadyForFeedback && savePrompt ? (
        <Card tone="accent">
          <View style={styles.oneThingHeader}>
            <Text style={styles.cardKicker}>{savePrompt.eyebrow}</Text>
            <XPBadge label={savePrompt.xpLabel} />
          </View>
          <Text style={styles.cardTitle}>{savePrompt.title}</Text>
          <Text style={styles.followUpBody}>{savePrompt.body}</Text>
          <View style={styles.feedbackActions}>
            <View style={styles.feedbackActionItem}>
              <AppButton label={savePrompt.ctaLabel} onPress={saveSession} />
            </View>
          </View>
          {followUpPrompt ? (
            isFollowUpExpanded ? (
              <View style={styles.followUpPromptBox}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.followUpPromptLabel}>{savePrompt.followUpLabel}</Text>
                  <Badge
                    label={includedFollowUp ? `+${FOLLOW_UP_BONUS_XP} XP ready` : followUpPrompt.focusLabel}
                    tone={includedFollowUp ? 'success' : 'secondary'}
                  />
                </View>
                <Text style={styles.followUpPromptText}>{followUpPrompt.prompt}</Text>
                <Text style={styles.followUpPromptNote}>{followUpPrompt.coachingNote}</Text>
                {!isFollowUpOpen ? null : (
                  <View style={styles.followUpInputShell}>
                    <TextInput
                      accessibilityHint="Type an optional follow-up answer"
                      accessibilityLabel="Roleplay follow-up answer"
                      multiline
                      onChangeText={setFollowUpAnswer}
                      placeholder="Add 1-2 more sentences for the follow-up."
                      placeholderTextColor={colors.textMuted}
                      ref={followUpInputRef}
                      style={styles.followUpInput}
                      textAlignVertical="top"
                      value={followUpAnswer}
                    />
                  </View>
                )}
                {followUpReview ? (
                  <View style={styles.followUpStatusBox}>
                    <View style={styles.oneThingHeader}>
                      <Text style={styles.followUpStatusLabel}>{followUpReview.readinessLabel}</Text>
                      <Badge
                        label={includedFollowUp ? 'Bonus unlocked' : 'Bonus locked'}
                        tone={includedFollowUp ? 'success' : 'info'}
                      />
                    </View>
                    <Text style={styles.followUpStatusText}>
                      {includedFollowUp
                        ? 'Good. Save now to bank the bonus XP and the extra turn.'
                        : `${followUpReview.reviewNote} Bonus XP unlocks after one stronger follow-up.`}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.followUpSummaryRow}>
                <View style={styles.followUpSummaryCopy}>
                  <View style={styles.oneThingHeader}>
                    <Text style={styles.followUpSummaryLabel}>{savePrompt.followUpLabel}</Text>
                    <Badge label={`+${FOLLOW_UP_BONUS_XP} XP`} tone="secondary" />
                  </View>
                  <Text numberOfLines={1} style={styles.followUpSummaryText}>
                    {followUpPrompt.coachingNote}
                  </Text>
                </View>
                <View style={styles.followUpSummaryButton}>
                  <AppButton
                    accessibilityHint="Starts the optional follow-up with an editable starter sentence"
                    label="Try bonus"
                    onPress={startFollowUpWithStarter}
                    size="small"
                    variant="quiet"
                  />
                </View>
              </View>
            )
          ) : null}
        </Card>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  backText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
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
  oneThingHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstQuestCue: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  firstQuestNumber: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  firstQuestNumberText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  firstQuestCopy: {
    flex: 1,
  },
  firstQuestEyebrow: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  firstQuestTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  firstQuestText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  promptText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.md,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  answerInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    minHeight: 132,
    padding: spacing.md,
  },
  answerInputActive: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  answerInputShell: {
    marginTop: spacing.md,
    position: 'relative',
  },
  answerPulseRing: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: radius.xl,
    borderWidth: 2,
    bottom: -4,
    left: -4,
    position: 'absolute',
    right: -4,
    top: -4,
  },
  answerAction: {
    marginTop: spacing.md,
  },
  warmupCueBox: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  warmupCueLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  warmupCueAction: {
    marginTop: spacing.md,
  },
  warmupCueText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  warmupCueNote: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  starterReminderRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  starterReminderCopy: {
    flex: 1,
    minWidth: 0,
  },
  starterReminderLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  starterReminderNote: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  starterReminderButton: {
    minWidth: 116,
  },
  betterEnglishBox: {
    backgroundColor: colors.correctionSoft,
    borderColor: colors.correction,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  betterEnglishLabel: {
    color: colors.infoDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  betterEnglishText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  feedbackChecklist: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  feedbackChecklistBox: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  feedbackChecklistItem: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  feedbackChecklistTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  feedbackActions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  feedbackActionItem: {
    flex: 1,
  },
  feedbackDetailsToggle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  feedbackDetailsToggleLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  feedbackDetailsToggleMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  feedbackHeroCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  feedbackScoreWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackScoreBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  feedbackScoreLabel: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  feedbackScoreRow: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  feedbackScores: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  feedbackXpBadge: {
    marginTop: spacing.sm,
  },
  feedbackScoreValue: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  feedbackSnapshotBox: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 2,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  feedbackSnapshotHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  feedbackSnapshotLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  feedbackSnapshotAnswerBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  feedbackSnapshotAnswerLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  feedbackSnapshotAnswerText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  feedbackSnapshotText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  feedbackSummaryText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  followUpBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  followUpInput: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    minHeight: 112,
    padding: spacing.md,
  },
  followUpInputShell: {
    marginTop: spacing.md,
  },
  followUpPromptBox: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  followUpPromptLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  followUpPromptNote: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  followUpPromptText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  followUpSummaryButton: {
    minWidth: 104,
  },
  followUpSummaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  followUpSummaryLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  followUpSummaryRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  followUpSummaryText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  followUpStatusBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  followUpStatusLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  followUpStatusText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  completeBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  levelUpBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  levelUpBox: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  levelUpLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  levelUpText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  savedNextLabel: {
    color: colors.infoDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  savedNextStep: {
    backgroundColor: colors.white,
    borderColor: colors.successDark,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  savedNextTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  savedPathBox: {
    backgroundColor: colors.white,
    borderColor: colors.successDark,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  savedPathLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  savedPathNext: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  savedPathProgress: {
    marginTop: spacing.md,
  },
  savedPathTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
});
