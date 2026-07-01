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
import { colors, fonts, radius, shadows, spacing, typography } from '../theme';
import type {
  DailyPracticeTarget,
  PracticeSession,
  RoleplayDraft,
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
import { createFeedbackMomentumRecap } from '../utils/feedbackMomentum';
import { createFirstQuestFeedbackState } from '../utils/firstQuestFeedback';
import { createAdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { createDailyMission } from '../utils/gamification';
import { createLevelProgress } from '../utils/levelProgress';
import {
  createPracticeCompletionSummary,
  createFirstQuestSaveRecap,
  createPracticeSaveLockInPreview,
  createPracticeSavePrompt,
  createSavedCoachRecap,
  createSavedLevelUpRecap,
  createPracticeTargetPreview,
  createSavedRoleplayMilestone,
  createSavedRoleplayHandoff,
  createSavedRoleplayPathProgress,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createPracticeSession } from '../utils/sessionHistory';
import { getStartingLevelProfile } from '../utils/startingLevel';
import { createFoundationWarmupPanel } from '../utils/foundationWarmupPanel';
import { createRoleplayFirstQuestState } from '../utils/roleplayFirstQuest';
import { createRoleplayFlowRunway, type RoleplayFlowRunway } from '../utils/roleplayFlowRunway';
import { createRoleplayPhraseHelperState } from '../utils/roleplayPhraseHelper';
import { createRoleplayResumeCue } from '../utils/roleplayResumeCue';
import { createRoleplayStarterReminder } from '../utils/roleplayStarterReminder';
import { createWritingSupportState } from '../utils/writingSupportHelper';

type RoleplayScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onBack: () => void;
  onClearDraft: () => void;
  onDraftChange: (draft: RoleplayDraft | null) => void;
  onOpenProgress: () => void;
  onSaveSession: (session: PracticeSession) => void;
  onSelectRoleplay: (roleplayId: RoleplayId) => void;
  roleplay: RoleplayScenario;
  savedDraft?: RoleplayDraft | null;
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
  onClearDraft,
  onDraftChange,
  onOpenProgress,
  onSaveSession,
  onSelectRoleplay,
  roleplay,
  savedDraft,
  sessions,
  startingLevelId,
  warmupCue,
}: RoleplayScreenProps) {
  const answerInputRef = useRef<TextInput>(null);
  const followUpInputRef = useRef<TextInput>(null);
  const [answerPulse] = useState(() => new Animated.Value(0));
  const [rewardPulse] = useState(() => new Animated.Value(0));
  const [draftAnswer, setDraftAnswer] = useState(
    () => savedDraft?.draftAnswer ?? (warmupCue?.autoApplyStarter ? warmupCue.starterAnswer : ''),
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
  const savedLevelUpRecap = levelUpMoment ? createSavedLevelUpRecap(levelUpMoment) : null;
  const savedMilestone = savedSession
    ? createSavedRoleplayMilestone({
      dailyTarget,
      savedSession,
      sessions,
      summary: progressData.summary,
    })
    : null;
  const savedSessionCountAfterSave = savedSession
    ? sessions.some((session) => session.id === savedSession.id)
      ? sessions.length
      : sessions.length + 1
    : sessions.length;
  const appUnlockedHandoff = savedSession && savedSessionCountAfterSave === 1
    ? {
      body: 'Learn and Wins are ready.',
      title: 'App unlocked',
    }
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
  const firstQuestFeedback = firstQuestState
    ? createFirstQuestFeedbackState({
      answerReview,
      feedbackResult,
    })
    : null;
  const firstQuestReviewHint = firstQuestState ? 'Save is next.' : null;
  const visibleFirstQuestState = warmupCue ? null : firstQuestState;
  const isReviewStep = Boolean(feedbackResult);
  const hasDraftAnswer = draftAnswer.trim().length > 0;
  const isAutoWarmupCue = Boolean(warmupCue?.autoApplyStarter);
  const hasRestoredDraft = Boolean(savedDraft?.draftAnswer) && !isAutoWarmupCue;
  const restoredDraftCue = hasRestoredDraft ? createRoleplayResumeCue(liveAnswerReview) : null;
  const foundationWarmupPanel = isAutoWarmupCue && warmupCue
    ? createFoundationWarmupPanel({
      editPlanSteps: levelProfile.starterEditSteps,
      note: warmupCue.note,
      starterAnswer: warmupCue.starterAnswer,
    })
    : null;
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
  const feedbackMomentum = feedbackResult && feedbackScoreSummary
    ? createFeedbackMomentumRecap({
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
  const firstQuestSaveRecap = firstQuestState && answerReview?.isReadyForFeedback
    ? createFirstQuestSaveRecap({
      progressLabel: targetPreview.progressLabel,
      progressTitle: targetPreview.title,
      unlockLabel: firstQuestState.unlockLabel,
      xpReward: totalXpReward,
    })
    : null;
  const isFollowUpExpanded = isFollowUpOpen || includedFollowUp;
  const answerRunway = createRoleplayFlowRunway('answer');
  const reviewRunway = createRoleplayFlowRunway('review');
  const saveRunway = createRoleplayFlowRunway('save');
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
  const rewardPulseStyle = {
    transform: [
      {
        scale: rewardPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.035],
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
    if (!savedSession) {
      rewardPulse.stopAnimation(() => rewardPulse.setValue(0));
      return;
    }

    rewardPulse.setValue(0);
    const pulse = Animated.sequence([
      Animated.timing(rewardPulse, {
        duration: 260,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rewardPulse, {
        duration: 320,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);

    pulse.start();

    return () => pulse.stop();
  }, [rewardPulse, savedSession]);

  useEffect(() => {
    if (!isFollowUpOpen) {
      return;
    }

    followUpInputRef.current?.focus();
  }, [isFollowUpOpen]);

  useEffect(() => {
    if (savedSession) {
      return;
    }

    const trimmedDraft = draftAnswer.trim();

    if (!trimmedDraft) {
      onClearDraft();
      return;
    }

    onDraftChange({
      draftAnswer: trimmedDraft,
      roleplayId: roleplay.id,
      updatedAt: new Date().toISOString(),
    });
  }, [draftAnswer, onClearDraft, onDraftChange, roleplay.id, savedSession]);

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
    onClearDraft();
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

  function startFreshAnswer() {
    setDraftAnswer('');
    setAnswerReview(null);
    setFeedbackResult(null);
    setFollowUpAnswer('');
    setHasAppliedBetterEnglish(false);
    setIsFeedbackDetailsOpen(false);
    setIsFollowUpOpen(false);
    setLevelUpMoment(null);
    onClearDraft();
    answerInputRef.current?.focus();
  }

  function startFollowUpWithStarter() {
    if (!followUpPrompt) {
      return;
    }

    setFollowUpAnswer(followUpPrompt.starterAnswer);
    setIsFollowUpOpen(true);
  }

  function renderFlowRunway(
    runway: RoleplayFlowRunway,
    currentStepMeta: string,
  ) {
    return (
      <View style={styles.flowRunway}>
        <View style={styles.flowRunwayHeader}>
          <Text style={styles.flowRunwayProgressLabel}>{runway.progressLabel}</Text>
          <Text numberOfLines={1} style={styles.flowRunwayCurrentLabel}>
            {currentStepMeta}
          </Text>
        </View>
        <View style={styles.flowRunwaySteps}>
          {runway.steps.map((step) => (
            <View
              key={step.id}
              style={[
                styles.flowRunwayStep,
                step.state === 'current' && styles.flowRunwayStepCurrent,
                step.state === 'done' && styles.flowRunwayStepDone,
              ]}
            >
              <View
                style={[
                  styles.flowRunwayStepNumber,
                  step.state === 'current' && styles.flowRunwayStepNumberCurrent,
                  step.state === 'done' && styles.flowRunwayStepNumberDone,
                ]}
              >
                <Text
                  style={[
                    styles.flowRunwayStepNumberText,
                    step.state === 'current' && styles.flowRunwayStepNumberTextCurrent,
                    step.state === 'done' && styles.flowRunwayStepNumberTextDone,
                  ]}
                >
                  {step.numberLabel}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.flowRunwayStepLabel,
                  step.state === 'current' && styles.flowRunwayStepLabelCurrent,
                  step.state === 'done' && styles.flowRunwayStepLabelDone,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
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
          <Animated.View style={[styles.rewardMomentCard, rewardPulseStyle]}>
            <View style={styles.rewardMomentHeader}>
              <Text style={styles.rewardMomentLabel}>Reward</Text>
              <XPBadge label={savedHandoff.xpLabel} />
            </View>
            <Text numberOfLines={1} style={styles.rewardMomentTitle}>
              Momentum saved
            </Text>
            <View style={styles.completeBadges}>
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
              {savedLevelUpRecap ? <Badge label={savedLevelUpRecap.badgeLabel} tone="accent" /> : null}
              {savedLevelUpRecap ? <Badge label={savedLevelUpRecap.totalXpLabel} tone="info" /> : null}
              {savedSession.includedFollowUp ? <Badge label="Follow-up saved" tone="secondary" /> : null}
            </View>
          </Animated.View>
          {appUnlockedHandoff ? (
            <View style={styles.appUnlockedStrip}>
              <View style={styles.appUnlockedBadge}>
                <Text style={styles.appUnlockedBadgeText}>GO</Text>
              </View>
              <View style={styles.appUnlockedCopy}>
                <Text numberOfLines={1} style={styles.appUnlockedLabel}>
                  {appUnlockedHandoff.title}
                </Text>
                <Text numberOfLines={1} style={styles.appUnlockedText}>
                  {appUnlockedHandoff.body}
                </Text>
              </View>
            </View>
          ) : null}
          {savedCoachRecap ? (
            <View style={styles.savedCoachStrip}>
              <Text numberOfLines={1} style={styles.savedCoachStripText}>
                <Text style={styles.savedCoachStripLabel}>Coach target </Text>
                {savedCoachRecap.badgeLabel}: {savedCoachRecap.text}
              </Text>
            </View>
          ) : null}
          {savedLevelUpRecap ? (
            <View style={styles.levelUpStrip}>
              <Text numberOfLines={1} style={styles.levelUpStripText}>
                <Text style={styles.levelUpStripLabel}>Level up </Text>
                {savedLevelUpRecap.text}
              </Text>
            </View>
          ) : null}
          {!savedPathProgress ? (
            <View style={styles.savedNextStep}>
              <Text numberOfLines={1} style={styles.savedNextText}>
                <Text style={styles.savedNextLabel}>{savedHandoff.nextLabel}: </Text>
                {savedHandoff.nextTitle}
              </Text>
            </View>
          ) : null}
          {savedPathProgress ? (
            <View style={styles.savedPathBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.savedPathLabel}>Next unlocked</Text>
                <Badge label={savedPathProgress.badgeLabel} tone="accent" />
              </View>
              <Text numberOfLines={1} style={styles.savedPathNext}>
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
          {renderFlowRunway(answerRunway, visibleFirstQuestState?.progressLabel ?? answerRunway.currentStepLabel)}
          <View style={styles.coachPromptBubble}>
            <View style={styles.coachPromptBadge}>
              <Text style={styles.coachPromptBadgeText}>SC</Text>
            </View>
            <View style={styles.coachPromptCopy}>
              <Text style={styles.promptLabel}>Coach asks</Text>
              <Text style={styles.promptText}>{openingLine}</Text>
            </View>
          </View>
          {foundationWarmupPanel && warmupCue ? (
            <View style={styles.foundationWarmupBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.foundationWarmupLabel}>{warmupCue.eyebrow}</Text>
                <Badge label={warmupCue.badgeLabel} tone="secondary" />
              </View>
              <Text style={styles.foundationWarmupTitle}>{foundationWarmupPanel.title}</Text>
              <Text style={styles.foundationWarmupBody}>{foundationWarmupPanel.body}</Text>
              <View style={styles.foundationWarmupStarterBox}>
                <Text style={styles.foundationWarmupStarterLabel}>
                  {foundationWarmupPanel.starterLabel}
                </Text>
                <Text style={styles.foundationWarmupStarterText}>
                  {foundationWarmupPanel.starterAnswer}
                </Text>
              </View>
              <View style={styles.foundationWarmupEditBox}>
                <Text style={styles.foundationWarmupEditLabel}>{foundationWarmupPanel.editPlanLabel}</Text>
                <View style={styles.foundationWarmupEditList}>
                  {foundationWarmupPanel.editPlanSteps.map((step, index) => (
                    <View key={`${index + 1}-${step}`} style={styles.foundationWarmupEditStep}>
                      <Text style={styles.foundationWarmupEditStepNumber}>{index + 1}</Text>
                      <Text style={styles.foundationWarmupEditStepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.foundationWarmupNote}>
                <Text style={styles.foundationWarmupNoteLabel}>
                  {foundationWarmupPanel.coachLabel}
                  {': '}
                </Text>
                {warmupCue.note}
              </Text>
            </View>
          ) : null}
          {hasRestoredDraft ? (
            <View style={styles.restoredDraftBox}>
              <Badge label={restoredDraftCue?.badgeLabel ?? 'Saved draft'} tone="success" />
              <Text numberOfLines={2} style={styles.restoredDraftText}>
                {restoredDraftCue?.body ?? 'Saved draft: edit, then check.'}
              </Text>
              <AppButton
                accessibilityHint="Clears the saved draft and starts a fresh answer"
                accessibilityLabel="Start fresh"
                label="Fresh"
                onPress={startFreshAnswer}
                size="small"
                variant="quiet"
              />
            </View>
          ) : null}
          <Text style={styles.answerSectionLabel}>
            {hasRestoredDraft ? 'Finish your answer' : 'Your answer'}
          </Text>
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
          <View style={styles.answerAction}>
            <AppButton
              disabled={draftAnswer.trim().length === 0}
              label="Check"
              onPress={reviewAnswer}
            />
          </View>
          <View style={styles.answerReadinessBox}>
            <Text numberOfLines={1} style={styles.answerReadinessTitle}>
              {answerReadinessCue.title}
            </Text>
            <Badge label={answerReadinessCue.badgeLabel} tone={answerReadinessCue.tone} />
          </View>
          <Pressable
            accessibilityHint="Shows or hides optional writing support before you check the answer"
            accessibilityLabel={writingSupport.toggleAccessibilityLabel}
            accessibilityRole="button"
            onPress={() => setIsWritingSupportOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [
              styles.writingSupportToggle,
              isWritingSupportOpen && styles.writingSupportToggleOpen,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.writingSupportToggleInner}>
              <Text style={styles.writingSupportToggleLabel}>Optional help</Text>
              <Text style={styles.writingSupportToggleCta}>
                {isWritingSupportOpen ? 'Hide' : 'Open'}
              </Text>
            </View>
          </Pressable>
          {isWritingSupportOpen ? (
            <View style={styles.writingSupportBox}>
              {warmupCue && !isAutoWarmupCue ? (
                <View style={styles.writingSupportSection}>
                  <View style={styles.oneThingHeader}>
                    <Text style={styles.writingSupportSectionLabel}>{warmupCue.eyebrow}</Text>
                    {!hasDraftAnswer ? (
                      <AppButton
                        accessibilityHint="Starts your answer with the suggested warm-up line"
                        accessibilityLabel={warmupCue.ctaLabel}
                        label={warmupCue.ctaLabel}
                        onPress={useWarmupStarter}
                        size="small"
                        variant="quiet"
                      />
                    ) : (
                      <Badge label={warmupCue.badgeLabel} tone="secondary" />
                    )}
                  </View>
                  <Text style={styles.writingSupportSectionText}>{warmupCue.correction}</Text>
                  <Text style={styles.writingSupportSectionMeta}>{warmupCue.note}</Text>
                </View>
              ) : null}
              {starterReminder && !warmupCue && !hasDraftAnswer ? (
                <View style={styles.writingSupportSection}>
                  <View style={styles.oneThingHeader}>
                    <Text style={styles.writingSupportSectionLabel}>{starterReminder.eyebrow}</Text>
                    <AppButton
                      accessibilityHint="Adds a simple starter answer to the answer box"
                      accessibilityLabel="Use starter answer"
                      label={starterReminder.ctaLabel}
                      onPress={useStarterAnswer}
                      size="small"
                      variant="quiet"
                    />
                  </View>
                </View>
              ) : null}
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
        </Card>
      ) : null}

      {feedbackResult ? (
        <Card tone="strong">
          {renderFlowRunway(reviewRunway, reviewRunway.currentStepLabel)}
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
          {firstQuestFeedback && firstQuestState ? (
            <View style={styles.firstQuestFeedbackBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.firstQuestFeedbackLabel}>Quest 1 coach</Text>
                <Badge
                  label={firstQuestFeedback.xpLabel ?? 'Quest 1'}
                  tone={firstQuestFeedback.xpLabel ? 'accent' : 'info'}
                />
              </View>
              <Text style={styles.firstQuestFeedbackTitle}>{firstQuestFeedback.title}</Text>
              <Text style={styles.firstQuestFeedbackBody}>{firstQuestFeedback.body}</Text>
              {firstQuestFeedback.rewrite && firstQuestFeedback.rewriteLabel ? (
                <View style={styles.firstQuestRewriteBox}>
                  <Text style={styles.firstQuestRewriteLabel}>{firstQuestFeedback.rewriteLabel}</Text>
                  <Text style={styles.firstQuestRewriteText}>{firstQuestFeedback.rewrite}</Text>
                </View>
              ) : null}
              {firstQuestReviewHint ? (
                <Text style={styles.firstQuestUnlockHint}>{firstQuestReviewHint}</Text>
              ) : null}
            </View>
          ) : null}
          {feedbackSnapshot ? null : (
            <Text style={styles.feedbackSummaryText}>{feedbackResult.feedback.summary}</Text>
          )}
          {feedbackSnapshot ? (
            <View style={styles.feedbackSnapshotBox}>
              <View style={styles.feedbackSnapshotHeader}>
                <Text style={styles.feedbackSnapshotLabel}>Coach recap</Text>
                {feedbackMomentum ? null : (
                  <Badge label={feedbackSnapshot.nextFocusLabel} tone="accent" />
                )}
              </View>
              {feedbackMomentum ? (
                <View style={styles.feedbackMomentumRow}>
                  <View style={styles.feedbackMomentumCard}>
                    <Text style={styles.feedbackMomentumLabel}>
                      {feedbackMomentum.strongestLabel}
                    </Text>
                    <Text numberOfLines={1} style={styles.feedbackMomentumValue}>
                      {feedbackMomentum.strongestValue}
                    </Text>
                  </View>
                  <View style={[styles.feedbackMomentumCard, styles.feedbackMomentumCardAccent]}>
                    <Text style={styles.feedbackMomentumLabel}>
                      {feedbackMomentum.nextFocusLabel}
                    </Text>
                    <Text numberOfLines={1} style={styles.feedbackMomentumValue}>
                      {feedbackMomentum.nextFocusValue}
                    </Text>
                  </View>
                </View>
              ) : null}
              <Text style={styles.feedbackSnapshotText}>
                {feedbackMomentum?.coachLine ?? feedbackSnapshot.nextMoveText}
              </Text>
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
          {renderFlowRunway(saveRunway, saveRunway.currentStepLabel)}
          <View style={styles.oneThingHeader}>
            <Text style={styles.cardKicker}>{savePrompt.eyebrow}</Text>
            <XPBadge label={savePrompt.xpLabel} />
          </View>
          <Text style={styles.cardTitle}>{savePrompt.title}</Text>
          <Text style={styles.followUpBody}>{savePrompt.body}</Text>
          {firstQuestSaveRecap ? (
            <View style={styles.saveLockInBox}>
              <Text style={styles.saveLockInLabel}>{firstQuestSaveRecap.eyebrow}</Text>
              {firstQuestSaveRecap.items.map((item) => (
                <View key={item.label} style={styles.saveLockInRow}>
                  <Text style={styles.saveLockInItemLabel}>{item.label}</Text>
                  <Text numberOfLines={1} style={styles.saveLockInItemValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ) : saveLockInPreview ? (
            <View style={styles.saveLockInBox}>
              <Text style={styles.saveLockInLabel}>{saveLockInPreview.eyebrow}</Text>
              {saveLockInPreview.items.map((item) => (
                <View key={item.label} style={styles.saveLockInRow}>
                  <Text style={styles.saveLockInItemLabel}>{item.label}</Text>
                  <Text numberOfLines={1} style={styles.saveLockInItemValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <View style={styles.feedbackActions}>
            <View style={styles.feedbackActionItem}>
              <AppButton
                label={firstQuestSaveRecap?.ctaLabel ?? savePrompt.ctaLabel}
                onPress={saveSession}
              />
            </View>
          </View>
          {followUpPrompt ? (
            isFollowUpExpanded ? (
              <View style={styles.followUpPromptBox}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.followUpPromptLabel}>Bonus step</Text>
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
                accessibilityHint={`Starts the optional follow-up focused on ${followUpPrompt.focusLabel.toLowerCase()}`}
                accessibilityLabel="Try optional bonus turn"
                accessibilityRole="button"
                onPress={startFollowUpWithStarter}
                style={({ pressed }) => [
                  styles.followUpBonusChip,
                  pressed && styles.followUpBonusChipPressed,
                ]}
              >
                <View style={styles.followUpBonusCopy}>
                  <Text style={styles.followUpSummaryLabel}>Optional after Save</Text>
                  <Text numberOfLines={1} style={styles.followUpBonusFocus}>
                    Bonus step: {followUpPrompt.focusLabel}
                  </Text>
                </View>
                <View style={styles.followUpBonusReward}>
                  <Text style={styles.followUpBonusCta}>{`+${FOLLOW_UP_BONUS_XP} XP`}</Text>
                  <Text style={styles.followUpBonusAction}>Try</Text>
                </View>
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
  flowRunway: {
    marginBottom: spacing.md,
  },
  flowRunwayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flowRunwayProgressLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  flowRunwayCurrentLabel: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginLeft: spacing.sm,
    minWidth: 0,
    textAlign: 'right',
  },
  flowRunwaySteps: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  flowRunwayStep: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 40,
    minWidth: 0,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  flowRunwayStepCurrent: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  flowRunwayStepDone: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  flowRunwayStepNumber: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  flowRunwayStepNumberCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  flowRunwayStepNumberDone: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
  },
  flowRunwayStepNumberText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  flowRunwayStepNumberTextCurrent: {
    color: colors.white,
  },
  flowRunwayStepNumberTextDone: {
    color: colors.white,
  },
  flowRunwayStepLabel: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    minWidth: 0,
  },
  flowRunwayStepLabelCurrent: {
    color: colors.primaryDark,
  },
  flowRunwayStepLabelDone: {
    color: colors.successDark,
  },
  coachPromptBubble: {
    backgroundColor: colors.coachSoft,
    borderColor: colors.coach,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  coachPromptBadge: {
    alignItems: 'center',
    backgroundColor: colors.coach,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  coachPromptBadgeText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  coachPromptCopy: {
    flex: 1,
    minWidth: 0,
  },
  answerSectionLabel: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.md,
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
  foundationWarmupBox: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  foundationWarmupLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  foundationWarmupTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  foundationWarmupBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  foundationWarmupStarterBox: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  foundationWarmupStarterLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  foundationWarmupStarterText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  foundationWarmupEditBox: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  foundationWarmupEditLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  foundationWarmupEditList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  foundationWarmupEditStep: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  foundationWarmupEditStepNumber: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.pill,
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    height: 18,
    lineHeight: 18,
    textAlign: 'center',
    width: 18,
  },
  foundationWarmupEditStepText: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  foundationWarmupNote: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  foundationWarmupNoteLabel: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  restoredDraftBox: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  restoredDraftText: {
    color: colors.successDark,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    minWidth: 0,
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
    minHeight: 120,
    padding: spacing.md,
  },
  answerInputActive: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  answerInputShell: {
    marginTop: spacing.sm,
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
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  answerReadinessTitle: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginRight: spacing.sm,
  },
  writingSupportToggle: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  writingSupportToggleOpen: {
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
  },
  writingSupportToggleInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  writingSupportToggleLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  writingSupportToggleCta: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
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
  firstQuestFeedbackBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  firstQuestFeedbackBox: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  firstQuestFeedbackLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  firstQuestFeedbackTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  firstQuestRewriteBox: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  firstQuestRewriteLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  firstQuestRewriteText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  firstQuestUnlockHint: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
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
  feedbackMomentumRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  feedbackMomentumCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    padding: spacing.sm,
  },
  feedbackMomentumCardAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  feedbackMomentumLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  feedbackMomentumValue: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveLockInItemLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  saveLockInItemValue: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginLeft: spacing.sm,
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
    minHeight: 24,
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
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    minWidth: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  followUpBonusChipPressed: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
  },
  followUpBonusCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },
  followUpBonusCta: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  followUpBonusFocus: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  followUpBonusReward: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  followUpBonusAction: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginTop: spacing.xxs,
  },
  followUpSummaryLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
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
    marginTop: spacing.sm,
  },
  rewardMomentCard: {
    ...shadows.soft,
    backgroundColor: colors.white,
    borderColor: colors.successDark,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  rewardMomentHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  rewardMomentLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  rewardMomentTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  appUnlockedStrip: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  appUnlockedBadge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.success,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  appUnlockedBadgeText: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  appUnlockedCopy: {
    flex: 1,
    minWidth: 0,
  },
  appUnlockedLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  appUnlockedText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  levelUpStrip: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  levelUpStripLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  levelUpStripText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
  },
  savedNextLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  savedNextStep: {
    backgroundColor: colors.white,
    borderColor: colors.successDark,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  savedNextText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
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
    padding: spacing.sm,
  },
  savedPathLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  savedPathNext: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  savedPathProgress: {
    marginTop: spacing.sm,
  },
});
