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
import { createAnswerReadinessCue } from '../utils/answerReadinessCue';
import { createAnswerCoachContent } from '../utils/answerCoach';
import { createAnswerPlanHelperState } from '../utils/answerPlanHelper';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createFeedbackScoreSummary } from '../utils/feedbackScoreSummary';
import { createFeedbackSnapshot } from '../utils/feedbackSnapshot';
import { createAdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { createDailyMission } from '../utils/gamification';
import { createLevelProgress } from '../utils/levelProgress';
import {
  createPracticeCompletionSummary,
  createPracticeSaveLockInPreview,
  createPracticeSavePrompt,
  createSavedCoachRecap,
  createPracticeTargetPreview,
  createSavedRoleplayMilestone,
  createSavedRoleplayHandoff,
  createSavedRoleplayPathProgress,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createPracticeSession } from '../utils/sessionHistory';
import { getStartingLevelProfile } from '../utils/startingLevel';
import { createRoleplayFirstQuestState } from '../utils/roleplayFirstQuest';
import { createRoleplayPhraseHelperState } from '../utils/roleplayPhraseHelper';
import { createRoleplayStarterReminder } from '../utils/roleplayStarterReminder';
import { createWritingSupportState } from '../utils/writingSupportHelper';

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
  const [draftAnswer, setDraftAnswer] = useState(
    () => (warmupCue?.autoApplyStarter ? warmupCue.starterAnswer : ''),
  );
  const [answerReview, setAnswerReview] = useState<AnswerReview | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<RuleBasedFeedbackResult | null>(null);
  const [savedSession, setSavedSession] = useState<PracticeSession | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [hasAppliedBetterEnglish, setHasAppliedBetterEnglish] = useState(false);
  const [isFeedbackDetailsOpen, setIsFeedbackDetailsOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isAnswerFocused, setIsAnswerFocused] = useState(false);
  const [isWritingSupportOpen, setIsWritingSupportOpen] = useState(false);
  const [levelUpMoment, setLevelUpMoment] = useState<LevelUpMoment | null>(null);

  const liveAnswerReview = summarizePracticeAnswer(draftAnswer);
  const answerReadinessCue = createAnswerReadinessCue(liveAnswerReview);
  const activeVariant = roleplay.promptVariants?.[0];
  const answerCoach = createAnswerCoachContent({
    persona: roleplay.aiPersona,
    promptVariant: activeVariant,
  });
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
  const savedCoachRecap = savedSession ? createSavedCoachRecap(savedSession) : null;
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
  const suggestedPhrases = activeVariant?.suggestedPhrases?.length
    ? activeVariant.suggestedPhrases
    : roleplay.suggestedPhrases;
  const phraseHelper = createRoleplayPhraseHelperState({
    isOpen: isWritingSupportOpen,
    phraseCount: suggestedPhrases.length,
  });
  const answerPlan = createAnswerPlanHelperState({
    isOpen: isWritingSupportOpen,
    steps: answerCoach.checklist,
  });
  const writingSupportQuickStart = starterReminder ? undefined : suggestedPhrases[0];
  const writingSupport = createWritingSupportState({
    isExpanded: isWritingSupportOpen,
    isAnswerPlanOpen: isWritingSupportOpen,
    phraseLabel: phraseHelper.summaryLabel,
    planLabel: answerPlan.stepCountLabel,
    quickStartPhrase: writingSupportQuickStart,
  });
  const firstQuestState = createRoleplayFirstQuestState({
    guidedStart,
    roleplayId: roleplay.id,
    sessions,
  });
  const visibleFirstQuestState = warmupCue ? null : firstQuestState;
  const isReviewStep = Boolean(feedbackResult);
  const hasDraftAnswer = draftAnswer.trim().length > 0;
  const isAutoWarmupCue = Boolean(warmupCue?.autoApplyStarter);
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
  const targetPreview = createPracticeTargetPreview({
    completedSessions: sessions.length,
    dailyTarget,
  });
  const saveLockInPreview = answerReview?.isReadyForFeedback
    ? createPracticeSaveLockInPreview({
      includedFollowUp,
      progressLabel: targetPreview.progressLabel,
      progressTitle: targetPreview.title,
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

  function addWritingSupportText(text: string) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setDraftAnswer((currentAnswer) => {
      const currentHasContent = currentAnswer.trim().length > 0;

      if (!currentHasContent) {
        return trimmedText;
      }

      if (currentAnswer.includes(trimmedText)) {
        return currentAnswer;
      }

      const needsSpace = currentAnswer.endsWith(' ') || currentAnswer.endsWith('\n');
      return `${currentAnswer}${needsSpace ? '' : ' '}${trimmedText}`;
    });
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
          {savedCoachRecap ? (
            <View style={styles.savedCoachStrip}>
              <Text numberOfLines={1} style={styles.savedCoachStripText}>
                <Text style={styles.savedCoachStripLabel}>Coach target </Text>
                {savedCoachRecap.badgeLabel}: {savedCoachRecap.text}
              </Text>
            </View>
          ) : null}
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
          <Text style={styles.promptLabel}>Coach asks</Text>
          <Text style={styles.promptText}>{openingLine}</Text>
          {warmupCue ? (
            <View style={[styles.warmupCueBox, isAutoWarmupCue && styles.warmupCueBoxCompact]}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.warmupCueLabel}>{warmupCue.eyebrow}</Text>
                <Badge label={warmupCue.badgeLabel} tone="secondary" />
              </View>
              {isAutoWarmupCue ? null : (
                <Text style={styles.warmupCueText}>{warmupCue.correction}</Text>
              )}
              {isAutoWarmupCue ? (
                <Text style={styles.warmupCueLoadedNote}>
                  Starter is in your draft. Edit, then check.
                </Text>
              ) : null}
              {isAutoWarmupCue ? null : <Text style={styles.warmupCueNote}>{warmupCue.note}</Text>}
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
          <View style={styles.answerReadinessBox}>
            <View style={styles.oneThingHeader}>
              <Text numberOfLines={1} style={styles.answerReadinessTitle}>
                {answerReadinessCue.title}
              </Text>
              <Badge label={answerReadinessCue.badgeLabel} tone={answerReadinessCue.tone} />
            </View>
            <View style={styles.answerReadinessProgress}>
              <ProgressBar
                label={answerReadinessCue.progressLabel}
                tone={answerReadinessCue.tone}
                value={answerReadinessCue.progressPercent}
              />
            </View>
          </View>
          <Pressable
            accessibilityHint="Shows or hides optional writing support before you check the answer"
            accessibilityLabel={writingSupport.toggleAccessibilityLabel}
            accessibilityRole="button"
            onPress={() => setIsWritingSupportOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [styles.writingSupportToggle, pressed && styles.pressed]}
          >
            <View style={styles.oneThingHeader}>
              <Text style={styles.writingSupportToggleLabel}>{writingSupport.title}</Text>
              <Text style={styles.writingSupportToggleCta}>{writingSupport.toggleLabel}</Text>
            </View>
            {isWritingSupportOpen ? (
              <View style={styles.writingSupportToggleMeta}>
                <Text style={styles.writingSupportHelperText}>{writingSupport.helperText}</Text>
                <Badge label={writingSupport.summaryLabel} tone="info" />
              </View>
            ) : null}
          </Pressable>
          {isWritingSupportOpen ? (
            <View style={styles.writingSupportBox}>
              <Text style={styles.writingSupportCoachNote}>
                {activeVariant?.coachingNote ?? answerCoach.instruction}
              </Text>
              {writingSupportQuickStart ? (
                <View style={styles.writingSupportSection}>
                  <View style={styles.oneThingHeader}>
                    <Text style={styles.writingSupportSectionLabel}>
                      {writingSupport.quickStartLabel}
                    </Text>
                    <AppButton
                      accessibilityHint="Adds a short starter phrase to your answer"
                      label="Use starter"
                      onPress={() => addWritingSupportText(writingSupport.quickStartText)}
                      size="small"
                      variant="quiet"
                    />
                  </View>
                  <Text style={styles.writingSupportSectionText}>
                    {writingSupport.quickStartText}
                  </Text>
                </View>
              ) : null}
              <View style={styles.writingSupportSection}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.writingSupportSectionLabel}>{answerPlan.title}</Text>
                  <Badge label={answerPlan.stepCountLabel} tone="secondary" />
                </View>
                {answerPlan.steps.map((step, index) => (
                  <Text key={step} style={styles.writingSupportPlanItem}>
                    {`${index + 1}. ${step}`}
                  </Text>
                ))}
              </View>
              <View style={styles.writingSupportSection}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.writingSupportSectionLabel}>Helpful phrases</Text>
                  <Badge label={phraseHelper.summaryLabel} tone="accent" />
                </View>
                <Text style={styles.writingSupportSectionMeta}>{phraseHelper.helperText}</Text>
                <View style={styles.writingSupportPhraseWrap}>
                  {suggestedPhrases.slice(0, 3).map((phrase) => (
                    <Pressable
                      accessibilityHint="Adds this phrase to your answer draft"
                      accessibilityLabel={`Use phrase ${phrase}`}
                      accessibilityRole="button"
                      key={phrase}
                      onPress={() => addWritingSupportText(phrase)}
                      style={({ pressed }) => [
                        styles.writingSupportPhraseChip,
                        pressed && styles.writingSupportPhraseChipPressed,
                      ]}
                    >
                      <Text numberOfLines={1} style={styles.writingSupportPhraseText}>{phrase}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ) : null}
          {starterReminder && !warmupCue && !hasDraftAnswer ? (
            <Pressable
              accessibilityHint="Adds a simple starter answer to the answer box"
              accessibilityLabel="Use starter answer"
              accessibilityRole="button"
              onPress={useStarterAnswer}
              style={({ pressed }) => [
                styles.starterReminderChip,
                pressed && styles.starterReminderChipPressed,
              ]}
            >
              <Text style={styles.starterReminderLabel}>{starterReminder.eyebrow}</Text>
              <Text style={styles.starterReminderCta}>{starterReminder.ctaLabel}</Text>
            </Pressable>
          ) : null}
          <View style={styles.answerAction}>
            <AppButton
              disabled={draftAnswer.trim().length === 0}
              label="Check answer"
              onPress={reviewAnswer}
            />
          </View>
          <View style={styles.dailyTargetPreviewBox}>
            <View style={styles.oneThingHeader}>
              <Text style={styles.dailyTargetPreviewLabel}>After save</Text>
              <Badge label={targetPreview.badgeLabel} tone={targetPreview.tone} />
            </View>
            <View style={styles.dailyTargetPreviewProgress}>
              <ProgressBar
                label={targetPreview.progressLabel}
                tone={targetPreview.tone}
                value={targetPreview.progressPercent}
              />
            </View>
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
          {saveLockInPreview ? (
            <View style={styles.saveLockInBox}>
              <Text style={styles.saveLockInLabel}>{saveLockInPreview.eyebrow}</Text>
              {saveLockInPreview.items.map((item) => (
                <View key={item.label} style={styles.saveLockInRow}>
                  <Text style={styles.saveLockInItemLabel}>{item.label}</Text>
                  <Text style={styles.saveLockInItemValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ) : null}
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
              <Pressable
                accessibilityHint="Starts the optional follow-up with an editable starter sentence"
                accessibilityLabel="Try optional bonus turn"
                accessibilityRole="button"
                onPress={startFollowUpWithStarter}
                style={({ pressed }) => [
                  styles.followUpBonusChip,
                  pressed && styles.followUpBonusChipPressed,
                ]}
              >
                <Text style={styles.followUpSummaryLabel}>{savePrompt.followUpLabel}</Text>
                <Text style={styles.followUpBonusCta}>{`Try +${FOLLOW_UP_BONUS_XP} XP`}</Text>
              </Pressable>
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
  warmupCueBoxCompact: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    padding: spacing.sm,
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
    marginTop: spacing.xs,
  },
  promptLabel: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
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
  answerReadinessBox: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  answerReadinessProgress: {
    marginTop: spacing.sm,
  },
  answerReadinessTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginRight: spacing.sm,
  },
  writingSupportToggle: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  writingSupportToggleLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  writingSupportToggleMeta: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  writingSupportHelperText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginRight: spacing.md,
  },
  writingSupportToggleCta: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  writingSupportBox: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  writingSupportCoachNote: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  writingSupportSection: {
    gap: spacing.sm,
  },
  writingSupportSectionLabel: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  writingSupportSectionMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  writingSupportSectionText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  writingSupportPlanItem: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  writingSupportPhraseWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  writingSupportPhraseChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    minWidth: 0,
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  writingSupportPhraseChipPressed: {
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
  },
  writingSupportPhraseText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    maxWidth: '100%',
  },
  dailyTargetPreviewBox: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  dailyTargetPreviewLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  dailyTargetPreviewProgress: {
    marginTop: spacing.sm,
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
  warmupCueLoadedNote: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  warmupCueNote: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  starterReminderChip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  starterReminderChipPressed: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  starterReminderCta: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  starterReminderLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
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
  saveLockInBox: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  saveLockInItemLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  saveLockInItemValue: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  saveLockInLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  saveLockInRow: {
    alignItems: 'center',
    flexDirection: 'row',
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
  followUpBonusChip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  followUpBonusChipPressed: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  followUpBonusCta: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  followUpSummaryLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
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
  savedCoachStrip: {
    backgroundColor: colors.white,
    borderColor: colors.successDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  savedCoachStripLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  savedCoachStripText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
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
