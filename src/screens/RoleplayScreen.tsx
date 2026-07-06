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
import { foundationStart, guidedStart, levelAssessment } from '../data/guidedIntro';
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
import { createFeedbackDetailsToggleState } from '../utils/feedbackDetailsToggle';
import { createFirstPathCoachCue } from '../utils/firstPathCoachCue';
import { createFirstQuestFeedbackState } from '../utils/firstQuestFeedback';
import { createAdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { createFollowUpReadinessCue } from '../utils/followUpReadinessCue';
import { createDailyMission } from '../utils/gamification';
import { createLevelProgress } from '../utils/levelProgress';
import {
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
import { createFoundationStarterAction } from '../utils/foundationStarterAction';
import { createFoundationStarterChecklist } from '../utils/foundationStarterChecklist';
import { createFoundationAnswerBoxCue } from '../utils/foundationAnswerBoxCue';
import { createRoleplayFirstQuestState } from '../utils/roleplayFirstQuest';
import { createRoleplayFlowRunway, type RoleplayFlowRunway } from '../utils/roleplayFlowRunway';
import { createRoleplayPhraseHelperState } from '../utils/roleplayPhraseHelper';
import { createRoleplayResumeCue } from '../utils/roleplayResumeCue';
import { createRoleplayStarterReminder } from '../utils/roleplayStarterReminder';
import { createReviewDecisionCue } from '../utils/reviewDecisionCue';
import { createWritingSupportState } from '../utils/writingSupportHelper';

type RoleplayScreenProps = {
  backLabel: string;
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
  backLabel,
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
  const backTargetLabel = backLabel.replace(/^Back to\s+/i, '');
  const includedFollowUp = Boolean(followUpReview?.isReadyForFeedback);
  const totalXpReward = baseXpReward + (includedFollowUp ? FOLLOW_UP_BONUS_XP : 0);
  const savedPathProgress = savedSession
    ? createSavedRoleplayPathProgress({
      roleplays: practiceContent.roleplays,
      savedSession,
      sessions,
    })
    : null;
  const savedSessionCountAfterSave = savedSession
    ? sessions.some((session) => session.id === savedSession.id)
      ? sessions.length
      : sessions.length + 1
    : sessions.length;
  const savedHandoff = createSavedRoleplayHandoff({
    dailyTarget,
    isPathComplete: savedPathProgress?.isPathComplete,
    nextPracticeTitle: savedPathProgress?.nextTitle ?? null,
    savedSessionCount: savedSessionCountAfterSave,
    xpReward: savedSession?.xpReward ?? totalXpReward,
  });
  const savedPracticeDepth = savedSession
    ? {
      body: savedSession.includedFollowUp
        ? 'Main answer and follow-up saved together.'
        : 'Main answer saved. Bonus turn stayed optional.',
      title: savedSession.includedFollowUp ? 'Deeper two-turn rep' : 'Core answer only',
    }
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
  const appUnlockedHandoff = savedSession && savedSessionCountAfterSave === 1
    ? {
      body: 'Learn and Wins are ready.',
      title: 'App unlocked',
    }
    : null;
  const levelProfile = getStartingLevelProfile(startingLevelId);
  const levelLabel =
    levelAssessment.choices.find((choice) => choice.id === startingLevelId)?.label ?? 'B1';
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
      progressLabel: firstQuestState.progressLabel,
      unlockLabel: firstQuestState.unlockLabel,
    })
    : null;
  const visibleFirstQuestState = warmupCue ? null : firstQuestState;
  const isReviewStep = Boolean(feedbackResult);
  const hasDraftAnswer = draftAnswer.trim().length > 0;
  const isAutoWarmupCue = Boolean(warmupCue?.autoApplyStarter);
  const hasRestoredDraft = Boolean(savedDraft?.draftAnswer) && !isAutoWarmupCue;
  const restoredDraftCue = hasRestoredDraft ? createRoleplayResumeCue(liveAnswerReview) : null;
  const foundationWarmupCoachCue = isAutoWarmupCue && warmupCue
    ? createFirstPathCoachCue({
      coachNote: levelProfile.coachMessage,
      firstLessonTitle: foundationStart.title,
      firstQuestTitle: guidedStart.title,
      levelLabel,
    })
    : null;
  const foundationWarmupPanel = isAutoWarmupCue && warmupCue
    ? createFoundationWarmupPanel({
      coachCueLabel: foundationWarmupCoachCue?.label ?? `${levelLabel} path coach`,
      coachCueMessage:
        foundationWarmupCoachCue?.message ??
        `We start with ${foundationStart.title}, then move into Job Interview.`,
      editPlanSteps: levelProfile.starterEditSteps,
      note: warmupCue.note,
      starterAnswer: warmupCue.starterAnswer,
      unlockProgress: firstQuestState
        ? {
          progressLabel: firstQuestState.progressLabel,
          unlockLabel: firstQuestState.unlockLabel,
        }
        : null,
    })
    : null;
  const foundationStarterAction = foundationWarmupPanel
    ? createFoundationStarterAction({
      draftAnswer,
      starterAnswer: foundationWarmupPanel.starterAnswer,
    })
    : null;
  const foundationStarterChecklist = foundationWarmupPanel
    ? createFoundationStarterChecklist({
      draftAnswer,
      isReadyForFeedback: liveAnswerReview.isReadyForFeedback,
      starterAnswer: foundationWarmupPanel.starterAnswer,
      steps: foundationWarmupPanel.editPlanSteps,
    })
    : null;
  const foundationAnswerBoxCue = foundationWarmupPanel
    ? createFoundationAnswerBoxCue({
      draftAnswer,
      isReadyForFeedback: liveAnswerReview.isReadyForFeedback,
      starterAnswer: foundationWarmupPanel.starterAnswer,
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
  const feedbackDetailsToggle = feedbackResult
    ? createFeedbackDetailsToggleState({
      improvementCount: feedbackResult.feedback.improvements.length,
      isOpen: isFeedbackDetailsOpen,
      scoreCount: feedbackResult.feedback.scores.length,
      strengthCount: feedbackResult.feedback.strengths.length,
    })
    : null;
  const reviewDecisionCue = feedbackResult && answerReview
    ? createReviewDecisionCue({
      feedbackResult,
      review: answerReview,
    })
    : null;
  const followUpPrompt = answerReview?.isReadyForFeedback
    ? createAdaptiveFollowUpPrompt(roleplay, draftAnswer, answerReview)
    : null;
  const targetPreview = createPracticeTargetPreview({
    completedSessions: sessions.length,
    dailyTarget,
  });
  const followUpReadinessCue = followUpPrompt && answerReview
    ? createFollowUpReadinessCue({
      focus: followUpPrompt.focus,
      progressTitle: targetPreview.title,
      review: answerReview,
    })
    : null;
  const savePrompt = answerReview?.isReadyForFeedback
    ? createPracticeSavePrompt({
      includedFollowUp,
      progressLabel: targetPreview.progressLabel,
      progressTitle: targetPreview.title,
      xpReward: totalXpReward,
    })
    : null;
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
    if (savedHandoff.ctaTarget === 'roleplay' && savedPathProgress) {
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

  function applyWarmupStarter() {
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

  function runFoundationStarterAction() {
    if (!foundationStarterAction) {
      return;
    }

    if (foundationStarterAction.mode === 'loaded') {
      answerInputRef.current?.focus();
      return;
    }

    applyWarmupStarter();
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
          accessibilityHint={`Return to ${backTargetLabel}`}
          accessibilityLabel={backLabel}
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text numberOfLines={1} style={styles.backText}>{backLabel}</Text>
        </Pressable>

        <GradientHero
          overline="Career win"
          subtitle={savedHandoff.body}
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
            {savedPracticeDepth ? (
              <View style={styles.practiceDepthStrip}>
                <Text style={styles.practiceDepthLabel}>Practice depth</Text>
                <Text numberOfLines={1} style={styles.practiceDepthTitle}>
                  {savedPracticeDepth.title}
                </Text>
                <Text numberOfLines={1} style={styles.practiceDepthBody}>
                  {savedPracticeDepth.body}
                </Text>
              </View>
            ) : null}
          </Animated.View>
          <View style={styles.savedPayoffStrip}>
            <Text numberOfLines={2} style={styles.savedPayoffText}>
              <Text style={styles.savedPayoffLabel}>After save </Text>
              {savedHandoff.payoffLine}
            </Text>
          </View>
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
              <View style={styles.savedPathHeader}>
                <View style={styles.savedPathHeaderCopy}>
                  <Text style={styles.savedPathLabel}>
                    {savedPathProgress.runway?.eyebrow ?? 'What unlocks next'}
                  </Text>
                  <Text numberOfLines={1} style={styles.savedPathTitle}>
                    {savedPathProgress.runway?.title ?? savedPathProgress.title}
                  </Text>
                </View>
                <Badge label={savedPathProgress.badgeLabel} tone="accent" />
              </View>
              <Text style={styles.savedPathBody}>
                {savedPathProgress.runway?.body ?? `${savedPathProgress.nextLabel}: ${savedPathProgress.nextTitle}`}
              </Text>
              {savedPathProgress.runway ? (
                <View style={styles.savedPathRunwayList}>
                  {savedPathProgress.runway.items.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.savedPathRunwayItem,
                        item.state === 'active' && styles.savedPathRunwayItemActive,
                        item.state === 'locked' && styles.savedPathRunwayItemLocked,
                      ]}
                    >
                      <View
                        style={[
                          styles.savedPathRunwaySequence,
                          item.state === 'active' && styles.savedPathRunwaySequenceActive,
                          item.state === 'locked' && styles.savedPathRunwaySequenceLocked,
                        ]}
                      >
                        <Text
                          style={[
                            styles.savedPathRunwaySequenceText,
                            item.state === 'active' && styles.savedPathRunwaySequenceTextActive,
                            item.state === 'locked' && styles.savedPathRunwaySequenceTextLocked,
                          ]}
                        >
                          {item.sequenceLabel}
                        </Text>
                      </View>
                      <View style={styles.savedPathRunwayCopy}>
                        <View style={styles.savedPathRunwayItemHeader}>
                          <Text numberOfLines={1} style={styles.savedPathRunwayItemTitle}>
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.savedPathRunwayStatus,
                              item.state === 'done' && styles.savedPathRunwayStatusDone,
                              item.state === 'active' && styles.savedPathRunwayStatusActive,
                              item.state === 'locked' && styles.savedPathRunwayStatusLocked,
                            ]}
                          >
                            {item.statusLabel}
                          </Text>
                        </View>
                        <Text numberOfLines={1} style={styles.savedPathRunwayItemMeta}>
                          {item.supportLabel}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text numberOfLines={1} style={styles.savedPathNext}>
                  {savedPathProgress.nextLabel}: {savedPathProgress.nextTitle}
                </Text>
              )}
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
        accessibilityHint={`Return to ${backTargetLabel}`}
        accessibilityLabel={backLabel}
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text numberOfLines={1} style={styles.backText}>{backLabel}</Text>
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
          {foundationWarmupPanel && warmupCue && foundationStarterAction && foundationStarterChecklist ? (
            <View style={styles.foundationWarmupBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.foundationWarmupLabel}>{warmupCue.eyebrow}</Text>
                <Badge label={warmupCue.badgeLabel} tone="secondary" />
              </View>
              <Text style={styles.foundationWarmupTitle}>{foundationWarmupPanel.title}</Text>
              <Text numberOfLines={2} style={styles.foundationWarmupBody}>{foundationWarmupPanel.body}</Text>
              <View style={styles.foundationWarmupSequence}>
                <View style={styles.foundationWarmupCoachCue}>
                  <View style={styles.foundationWarmupCoachBadge}>
                    <Text style={styles.foundationWarmupCoachBadgeText}>SC</Text>
                  </View>
                  <View style={styles.foundationWarmupCoachCopy}>
                    <Text style={styles.foundationWarmupCoachLabel}>
                      {foundationWarmupPanel.coachCueLabel}
                    </Text>
                    <Text style={styles.foundationWarmupCoachText}>
                      {foundationWarmupPanel.coachCueMessage}
                    </Text>
                  </View>
                </View>
                {foundationWarmupPanel.unlockProgress ? (
                  <View style={styles.foundationWarmupUnlockStrip}>
                    <View style={styles.foundationWarmupUnlockCopy}>
                      <Text numberOfLines={1} style={styles.foundationWarmupUnlockLabel}>
                        {foundationWarmupPanel.unlockProgress.unlockLabel}
                      </Text>
                      <Text numberOfLines={2} style={styles.foundationWarmupUnlockBody}>
                        {foundationWarmupPanel.unlockProgress.body}
                      </Text>
                    </View>
                    <Badge label={foundationWarmupPanel.unlockProgress.progressLabel} tone="accent" />
                  </View>
                ) : null}
                <View style={styles.foundationWarmupStarterBox}>
                  <View style={styles.foundationWarmupStarterHeader}>
                    <Text style={styles.foundationWarmupStarterLabel}>
                      {foundationWarmupPanel.starterLabel}
                    </Text>
                    <AppButton
                      accessibilityHint={
                        foundationStarterAction.mode === 'loaded'
                          ? 'Moves focus to the answer box so you can edit the starter'
                          : 'Loads the original Lesson 1 starter into the answer box again'
                      }
                      label={foundationStarterAction.ctaLabel}
                      onPress={runFoundationStarterAction}
                      size="small"
                      variant="quiet"
                    />
                  </View>
                  <Text numberOfLines={3} style={styles.foundationWarmupStarterText}>
                    {foundationWarmupPanel.starterAnswer}
                  </Text>
                </View>
              </View>
              <View style={styles.foundationWarmupActionBox}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.foundationWarmupActionTitle}>
                    {foundationStarterAction.title}
                  </Text>
                  <Badge
                    label={foundationStarterAction.badgeLabel}
                    tone={foundationStarterAction.tone}
                  />
                </View>
                <Text style={styles.foundationWarmupActionBody}>
                  {foundationStarterAction.body}
                </Text>
              </View>
              <View style={styles.foundationWarmupEditBox}>
                <View style={styles.foundationWarmupEditHeader}>
                  <Text style={styles.foundationWarmupEditLabel}>{foundationWarmupPanel.editPlanLabel}</Text>
                  <Badge label={foundationStarterChecklist.progressLabel} tone="secondary" />
                </View>
                <View style={styles.foundationWarmupEditList}>
                  {foundationStarterChecklist.items.map((step, index) => (
                    <View
                      key={`${index + 1}-${step.text}`}
                      style={[
                        styles.foundationWarmupEditStep,
                        step.state === 'current' && styles.foundationWarmupEditStepCurrent,
                        step.state === 'done' && styles.foundationWarmupEditStepDone,
                      ]}
                    >
                      <Text
                        style={[
                          styles.foundationWarmupEditStepNumber,
                          step.state === 'current' && styles.foundationWarmupEditStepNumberCurrent,
                          step.state === 'done' && styles.foundationWarmupEditStepNumberDone,
                        ]}
                      >
                        {index + 1}
                      </Text>
                      <Text style={styles.foundationWarmupEditStepText}>{step.text}</Text>
                      <Text
                        style={[
                          styles.foundationWarmupEditStepStatus,
                          step.state === 'current' && styles.foundationWarmupEditStepStatusCurrent,
                          step.state === 'done' && styles.foundationWarmupEditStepStatusDone,
                        ]}
                      >
                        {step.statusLabel}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
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
          {foundationAnswerBoxCue ? (
            <View
              style={[
                styles.answerInputCueBox,
                foundationAnswerBoxCue.tone === 'accent' && styles.answerInputCueBoxAccent,
                foundationAnswerBoxCue.tone === 'success' && styles.answerInputCueBoxSuccess,
              ]}
            >
              <View style={styles.oneThingHeader}>
                <Text style={styles.answerInputCueLabel}>Edit in the answer box</Text>
                <Badge label={foundationAnswerBoxCue.badgeLabel} tone={foundationAnswerBoxCue.tone} />
              </View>
              <Text style={styles.answerInputCueTitle}>{foundationAnswerBoxCue.title}</Text>
              <Text style={styles.answerInputCueBody}>{foundationAnswerBoxCue.body}</Text>
            </View>
          ) : null}
          <View
            style={[
              styles.answerInputShell,
              foundationAnswerBoxCue && styles.answerInputShellGuided,
              foundationAnswerBoxCue?.tone === 'success' && styles.answerInputShellGuidedSuccess,
            ]}
          >
            {shouldPulseAnswer ? (
              <Animated.View
                pointerEvents="none"
                style={[styles.answerPulseRing, answerPulseStyle]}
              />
            ) : null}
            {foundationAnswerBoxCue ? (
              <View style={styles.answerInputFrameHeader}>
                <Text style={styles.answerInputFrameLabel}>
                  {foundationStarterAction?.mode === 'loaded' ? 'Loaded starter' : 'Your editable draft'}
                </Text>
                <Text style={styles.answerInputFrameMeta}>
                  {foundationStarterAction?.mode === 'loaded'
                    ? 'Tap into the text below and replace it with your own example.'
                    : 'Keep shaping the answer directly here before you check.'}
                </Text>
              </View>
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
              style={[
                styles.answerInput,
                foundationAnswerBoxCue && styles.answerInputGuided,
                (isAnswerFocused || hasDraftAnswer) && styles.answerInputActive,
                foundationAnswerBoxCue?.tone === 'success' && styles.answerInputGuidedSuccess,
              ]}
              textAlignVertical="top"
              value={draftAnswer}
            />
          </View>
          <View
            style={[
              styles.answerPrimaryActionBox,
              answerReadinessCue.tone === 'accent' && styles.answerPrimaryActionBoxAccent,
              answerReadinessCue.tone === 'success' && styles.answerPrimaryActionBoxSuccess,
            ]}
          >
            <View style={styles.oneThingHeader}>
              <Text style={styles.answerPrimaryActionLabel}>Primary next step</Text>
              <Badge label={answerReadinessCue.badgeLabel} tone={answerReadinessCue.tone} />
            </View>
            <Text style={styles.answerPrimaryActionTitle}>
              {foundationAnswerBoxCue
                ? foundationAnswerBoxCue.tone === 'success'
                  ? 'Check your edited answer'
                  : 'Finish editing, then check'
                : answerReadinessCue.title}
            </Text>
            <Text style={styles.answerPrimaryActionBody}>
              {foundationAnswerBoxCue?.body ?? answerReadinessCue.note}
            </Text>
            <View style={styles.answerAction}>
              <AppButton
                disabled={draftAnswer.trim().length === 0}
                label="Check"
                onPress={reviewAnswer}
              />
            </View>
            <Text style={styles.answerPrimaryActionMeta}>{answerReadinessCue.progressLabel}</Text>
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
                        onPress={applyWarmupStarter}
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
              {firstQuestFeedback.nextUnlock ? (
                <View style={styles.firstQuestUnlockBox}>
                  <View style={styles.oneThingHeader}>
                    <Text style={styles.firstQuestUnlockLabel}>
                      {firstQuestFeedback.nextUnlock.eyebrow}
                    </Text>
                    <Badge label={firstQuestFeedback.nextUnlock.progressLabel} tone="accent" />
                  </View>
                  <Text style={styles.firstQuestUnlockTitle}>
                    {firstQuestFeedback.nextUnlock.title}
                  </Text>
                  <Text style={styles.firstQuestUnlockBody}>
                    {firstQuestFeedback.nextUnlock.body}
                  </Text>
                </View>
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
          <View style={styles.betterEnglishBox}>
            <Text style={styles.betterEnglishLabel}>Better English</Text>
            <Text style={styles.betterEnglishText}>{feedbackResult.feedback.suggestedRewrite}</Text>
          </View>
          {reviewDecisionCue ? (
            <View style={styles.reviewDecisionBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.reviewDecisionLabel}>Your call</Text>
                <Badge label={reviewDecisionCue.badgeLabel} tone={reviewDecisionCue.tone} />
              </View>
              <Text style={styles.reviewDecisionTitle}>{reviewDecisionCue.title}</Text>
              <Text style={styles.reviewDecisionBody}>{reviewDecisionCue.body}</Text>
            </View>
          ) : null}
          {feedbackDetailsToggle ? (
            <Pressable
              accessibilityHint={
                isFeedbackDetailsOpen
                  ? 'Hides the optional score bars and coach notes'
                  : 'Opens the optional score bars and coach notes'
              }
              accessibilityLabel={feedbackDetailsToggle.title}
              accessibilityRole="button"
              onPress={() => setIsFeedbackDetailsOpen((isOpen) => !isOpen)}
              style={({ pressed }) => [styles.feedbackDetailsToggle, pressed && styles.pressed]}
            >
              <View style={styles.feedbackDetailsToggleCopy}>
                <Text style={styles.feedbackDetailsToggleLabel}>{feedbackDetailsToggle.title}</Text>
                <Text style={styles.feedbackDetailsToggleMeta}>{feedbackDetailsToggle.meta}</Text>
              </View>
              <Badge
                label={feedbackDetailsToggle.badgeLabel}
                tone={feedbackDetailsToggle.tone}
              />
            </Pressable>
          ) : null}
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
          {answerReview && !answerReview.isReadyForFeedback ? (
            <View style={styles.feedbackActions}>
              <View style={styles.feedbackActionItem}>
                <AppButton
                  accessibilityHint="Returns to the answer box so you can add more detail"
                  label="Add more first"
                  onPress={retryAnswer}
                  variant="secondary"
                />
              </View>
            </View>
          ) : null}
        </Card>
      ) : null}

      {feedbackResult && answerReview?.isReadyForFeedback && savePrompt ? (
        <Card tone="accent">
          {renderFlowRunway(saveRunway, saveRunway.currentStepLabel)}
          <View style={styles.oneThingHeader}>
            <Text style={styles.cardKicker}>{savePrompt.eyebrow}</Text>
            <XPBadge label={savePrompt.xpLabel} />
          </View>
          <Text style={styles.cardTitle}>
            {firstQuestSaveRecap?.primaryTitle ?? savePrompt.title}
          </Text>
          <Text style={styles.followUpBody}>
            {firstQuestSaveRecap?.primaryBody ?? savePrompt.body}
          </Text>
          {firstQuestSaveRecap ? (
            <View style={styles.firstQuestSavePrimaryBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.firstQuestSavePrimaryLabel}>Primary next step</Text>
                <Badge label="One tap" tone="accent" />
              </View>
              <AppButton
                accessibilityHint="Saves this answer and unlocks the guided Home and Progress areas"
                label={firstQuestSaveRecap.ctaLabel}
                onPress={saveSession}
              />
            </View>
          ) : null}
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
          {!firstQuestSaveRecap ? (
            <View style={styles.feedbackActions}>
              <View style={styles.feedbackActionItem}>
                <AppButton
                  label={savePrompt.ctaLabel}
                  onPress={saveSession}
                />
              </View>
            </View>
          ) : null}
          {hasAppliedBetterEnglish ? null : (
            <View style={styles.saveSecondaryActions}>
              <Text style={styles.saveSecondaryLabel}>Want one cleaner version first?</Text>
              <View style={styles.saveSecondaryButtonRow}>
                <View style={styles.feedbackActionItem}>
                  <AppButton
                    accessibilityHint="Moves the better English rewrite back into the answer box"
                    label="Try rewrite"
                    onPress={useBetterEnglishAnswer}
                    variant="secondary"
                  />
                </View>
                <View style={styles.feedbackActionItem}>
                  <AppButton
                    accessibilityHint="Returns to your draft so you can improve it before saving"
                    label="Edit answer"
                    onPress={retryAnswer}
                    variant="quiet"
                  />
                </View>
              </View>
            </View>
          )}
          {followUpPrompt ? (
            isFollowUpExpanded ? (
              <View style={styles.followUpPromptBox}>
                <View style={styles.oneThingHeader}>
                  <Text style={styles.followUpPromptLabel}>Bonus step</Text>
                  <Badge
                    label={includedFollowUp ? `+${FOLLOW_UP_BONUS_XP} XP ready` : followUpReadinessCue?.badgeLabel ?? followUpPrompt.focusLabel}
                    tone={includedFollowUp ? 'success' : followUpReadinessCue?.tone ?? 'secondary'}
                  />
                </View>
                {followUpReadinessCue ? (
                  <View style={styles.followUpDecisionBox}>
                    <Text style={styles.followUpDecisionTitle}>{followUpReadinessCue.title}</Text>
                    <Text style={styles.followUpDecisionBody}>{followUpReadinessCue.body}</Text>
                  </View>
                ) : null}
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
                  <Text style={styles.followUpSummaryLabel}>Optional turn</Text>
                  <Text numberOfLines={1} style={styles.followUpBonusTitle}>
                    {followUpReadinessCue?.title ?? `Bonus step: ${followUpPrompt.focusLabel}`}
                  </Text>
                  <Text numberOfLines={2} style={styles.followUpBonusFocus}>
                    {followUpReadinessCue?.chipLine ?? `Bonus step: ${followUpPrompt.focusLabel}`}
                  </Text>
                </View>
                <View style={styles.followUpBonusReward}>
                  <Text style={styles.followUpBonusCta}>
                    {followUpReadinessCue?.badgeLabel ?? 'Optional'}
                  </Text>
                  <Text style={styles.followUpBonusAction}>{`+${FOLLOW_UP_BONUS_XP} XP`}</Text>
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
  answerInputCueBox: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  answerInputCueBoxAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  answerInputCueBoxSuccess: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  answerInputCueLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  answerInputCueTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  answerInputCueBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
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
  foundationWarmupSequence: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  foundationWarmupCoachCue: {
    alignItems: 'flex-start',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  foundationWarmupCoachBadge: {
    alignItems: 'center',
    backgroundColor: colors.secondaryDark,
    borderRadius: radius.pill,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  foundationWarmupCoachBadgeText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  foundationWarmupCoachCopy: {
    flex: 1,
    minWidth: 0,
  },
  foundationWarmupCoachLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  foundationWarmupCoachText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  foundationWarmupUnlockStrip: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  foundationWarmupUnlockCopy: {
    flex: 1,
    minWidth: 0,
  },
  foundationWarmupUnlockLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  foundationWarmupUnlockBody: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  foundationWarmupStarterBox: {
    backgroundColor: colors.white,
    padding: spacing.sm,
  },
  foundationWarmupStarterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  foundationWarmupStarterLabel: {
    color: colors.secondaryDark,
    flex: 1,
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
  foundationWarmupEditHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  foundationWarmupEditList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  foundationWarmupEditStep: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  foundationWarmupEditStepCurrent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  foundationWarmupEditStepDone: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  foundationWarmupEditStepNumber: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.pill,
    color: colors.secondaryDark,
    borderWidth: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    height: 18,
    lineHeight: 18,
    textAlign: 'center',
    width: 18,
  },
  foundationWarmupEditStepNumberCurrent: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
    color: colors.white,
  },
  foundationWarmupEditStepNumberDone: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
    color: colors.white,
  },
  foundationWarmupEditStepText: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  foundationWarmupEditStepStatus: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  foundationWarmupEditStepStatusCurrent: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
    color: colors.white,
  },
  foundationWarmupEditStepStatusDone: {
    backgroundColor: colors.white,
    borderColor: colors.success,
    color: colors.successDark,
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
  answerInputGuided: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  answerInputGuidedSuccess: {
    borderColor: colors.success,
  },
  answerInputActive: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  answerInputShell: {
    marginTop: spacing.sm,
    position: 'relative',
  },
  answerInputShellGuided: {
    backgroundColor: colors.surface,
    borderColor: colors.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.sm,
  },
  answerInputShellGuidedSuccess: {
    borderColor: colors.success,
  },
  answerInputFrameHeader: {
    gap: spacing.xxs,
    marginBottom: spacing.sm,
  },
  answerInputFrameLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  answerInputFrameMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
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
    marginTop: spacing.sm,
  },
  answerPrimaryActionBox: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  answerPrimaryActionBoxAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  answerPrimaryActionBoxSuccess: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  answerPrimaryActionLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  answerPrimaryActionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  answerPrimaryActionBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
  },
  answerPrimaryActionMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
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
    borderColor: colors.correctionSoft,
    borderLeftColor: colors.correction,
    borderLeftWidth: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  betterEnglishLabel: {
    color: colors.infoDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  betterEnglishText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
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
  saveSecondaryActions: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  saveSecondaryButtonRow: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  saveSecondaryLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  reviewDecisionBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  reviewDecisionBox: {
    backgroundColor: colors.coachSoft,
    borderColor: colors.primaryGlow,
    borderLeftColor: colors.coach,
    borderLeftWidth: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  reviewDecisionLabel: {
    color: colors.coach,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  reviewDecisionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  foundationWarmupActionBox: {
    backgroundColor: colors.white,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  foundationWarmupActionTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginRight: spacing.sm,
  },
  foundationWarmupActionBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
  feedbackDetailsToggleCopy: {
    flex: 1,
    marginRight: spacing.sm,
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
  firstQuestUnlockBody: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  firstQuestUnlockBox: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  firstQuestUnlockLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  firstQuestUnlockTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
  firstQuestSavePrimaryBox: {
    ...shadows.soft,
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  firstQuestSavePrimaryLabel: {
    color: colors.accentDark,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginRight: spacing.sm,
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
  followUpDecisionBox: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderLeftColor: colors.accent,
    borderLeftWidth: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  followUpDecisionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
  },
  followUpDecisionBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
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
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.secondary,
  },
  followUpBonusCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },
  followUpBonusCta: {
    color: colors.secondaryDark,
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
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
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
  followUpBonusTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
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
  practiceDepthStrip: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderLeftColor: colors.successDark,
    borderLeftWidth: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  practiceDepthLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  practiceDepthTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  practiceDepthBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  appUnlockedStrip: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  appUnlockedBadge: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.success,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
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
  savedPayoffStrip: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  savedPayoffLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  savedPayoffText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
  },
  levelUpStrip: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
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
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
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
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
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
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  savedPathBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  savedPathHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  savedPathHeaderCopy: {
    flex: 1,
    minWidth: 0,
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
  savedPathRunwayCopy: {
    flex: 1,
    minWidth: 0,
  },
  savedPathRunwayItem: {
    alignItems: 'flex-start',
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  savedPathRunwayItemActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  savedPathRunwayItemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  savedPathRunwayItemLocked: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  savedPathRunwayItemMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    lineHeight: typography.lineSmall,
    minWidth: 0,
    marginTop: spacing.xxs,
  },
  savedPathRunwayStatus: {
    borderRadius: radius.pill,
    borderWidth: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  savedPathRunwayStatusActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    color: colors.white,
  },
  savedPathRunwayStatusDone: {
    backgroundColor: colors.white,
    borderColor: colors.success,
    color: colors.successDark,
  },
  savedPathRunwayStatusLocked: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    color: colors.textMuted,
  },
  savedPathRunwayItemTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    minWidth: 0,
  },
  savedPathRunwayList: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  savedPathRunwaySequence: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.success,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginTop: 1,
    width: 22,
  },
  savedPathRunwaySequenceActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  savedPathRunwaySequenceLocked: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  savedPathRunwaySequenceText: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  savedPathRunwaySequenceTextActive: {
    color: colors.white,
  },
  savedPathRunwaySequenceTextLocked: {
    color: colors.textMuted,
  },
  savedPathTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: 2,
  },
});
