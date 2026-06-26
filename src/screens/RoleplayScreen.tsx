import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario } from '../types';
import { createAnswerCoachContent } from '../utils/answerCoach';
import { createAnswerPlanHelperState } from '../utils/answerPlanHelper';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createAdaptiveFollowUpPrompt, type AdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { createFocusTimerControls, FOCUS_SESSION_SECONDS, formatFocusTime } from '../utils/focusTimer';
import { createLocalProgressStats } from '../utils/localProgress';
import {
  createPracticeCompletionMilestone,
  createNextPracticeRecommendation,
  createPracticeCompletionSummary,
  createPracticeSavePrompt,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createRoleplayAnglePickerState } from '../utils/roleplayAnglePicker';
import { createRoleplayGuideState } from '../utils/roleplayGuide';
import { createRoleplayPhraseHelperState } from '../utils/roleplayPhraseHelper';
import { createRoleplayReadCard } from '../utils/roleplayReadCard';
import {
  createRoleplayScenarioPickerState,
  formatRoleplayScenarioMeta,
} from '../utils/roleplayScenarioPicker';
import { createPracticeSession } from '../utils/sessionHistory';
import { createWritingSupportState } from '../utils/writingSupportHelper';

type RoleplayScreenProps = {
  dailyTarget: DailyPracticeTarget;
  roleplay: RoleplayScenario;
  onOpenProgress: () => void;
  onSelectRoleplay: (roleplayId: RoleplayId) => void;
  onSaveSession: (session: PracticeSession) => void;
  sessions: PracticeSession[];
};

export function RoleplayScreen({
  dailyTarget,
  onOpenProgress,
  onSaveSession,
  roleplay,
  onSelectRoleplay,
  sessions,
}: RoleplayScreenProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [answerReview, setAnswerReview] = useState<AnswerReview | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<RuleBasedFeedbackResult | null>(null);
  const [savedSession, setSavedSession] = useState<PracticeSession | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(FOCUS_SESSION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [followUpReview, setFollowUpReview] = useState<AnswerReview | null>(null);
  const [adaptiveFollowUp, setAdaptiveFollowUp] = useState<AdaptiveFollowUpPrompt | null>(null);
  const [isScenarioPickerOpen, setIsScenarioPickerOpen] = useState(false);
  const [isAnglePickerOpen, setIsAnglePickerOpen] = useState(false);
  const [isWritingSupportOpen, setIsWritingSupportOpen] = useState(false);
  const [isAnswerPlanOpen, setIsAnswerPlanOpen] = useState(false);
  const [isAnswerFocused, setIsAnswerFocused] = useState(false);
  const [activePromptVariantId, setActivePromptVariantId] = useState(
    roleplay.promptVariants?.[0]?.id ?? null,
  );

  const roleplayPromptVariants = roleplay.promptVariants ?? [];
  const activePromptVariant =
    roleplayPromptVariants.find((variant) => variant.id === activePromptVariantId) ??
    roleplayPromptVariants[0];
  const activeSuggestedPhrases = activePromptVariant?.suggestedPhrases ?? roleplay.suggestedPhrases;
  const quickStartPhrase = activeSuggestedPhrases[0];
  const extraSuggestedPhrases = activeSuggestedPhrases.slice(1);
  const answerCoach = createAnswerCoachContent({
    persona: roleplay.aiPersona,
    promptVariant: activePromptVariant,
  });
  const answerPlan = createAnswerPlanHelperState({
    isOpen: isAnswerPlanOpen,
    steps: answerCoach.checklist,
  });
  const timerControls = createFocusTimerControls({
    isRunning: isTimerRunning,
    secondsRemaining: timerSeconds,
  });
  const scenarioPicker = createRoleplayScenarioPickerState({
    activeRoleplayId: roleplay.id,
    isOpen: isScenarioPickerOpen,
    roleplays: practiceContent.roleplays,
  });
  const anglePicker = createRoleplayAnglePickerState({
    activeVariantId: activePromptVariant?.id ?? null,
    isOpen: isAnglePickerOpen,
    variants: roleplayPromptVariants,
  });
  const phraseHelper = createRoleplayPhraseHelperState({
    isOpen: isWritingSupportOpen,
    phraseCount: activeSuggestedPhrases.length,
  });
  const writingSupport = createWritingSupportState({
    isExpanded: isWritingSupportOpen,
    isAnswerPlanOpen,
    phraseLabel: phraseHelper.summaryLabel,
    planLabel: answerPlan.stepCountLabel,
    quickStartPhrase,
  });
  const readCard = createRoleplayReadCard({
    activePromptVariant,
    roleplay,
  });
  const followUpBonusXp = followUpReview?.isReadyForFeedback ? 15 : 0;
  const totalXpReward = (feedbackResult?.xpReward ?? 0) + followUpBonusXp;
  const completionSummary = savedSession
    ? createPracticeCompletionSummary({
        includedFollowUp: Boolean(followUpReview?.isReadyForFeedback),
        roleplayTitle: roleplay.title,
        xpReward: totalXpReward,
      })
    : null;
  const completionSessions = savedSession
    ? sessions.some((session) => session.id === savedSession.id)
      ? sessions
      : [savedSession, ...sessions]
    : sessions;
  const completionMilestone = savedSession
    ? createPracticeCompletionMilestone({
        dailyTarget,
        progress: createLocalProgressStats(progressData.summary, completionSessions, dailyTarget),
      })
    : null;
  const nextPracticeRecommendation = completionSummary
    ? createNextPracticeRecommendation(roleplay.id, practiceContent.roleplays)
    : null;
  const savePrompt =
    answerReview?.isReadyForFeedback && !savedSession
      ? createPracticeSavePrompt({
          includedFollowUp: Boolean(followUpReview?.isReadyForFeedback),
          xpReward: totalXpReward,
        })
      : null;
  const roleplayGuide = createRoleplayGuideState({
    hasDraftAnswer: draftAnswer.trim().length > 0,
    hasReviewedAnswer: Boolean(answerReview),
    isReadyForFeedback: Boolean(answerReview?.isReadyForFeedback && feedbackResult),
    isSaved: Boolean(savedSession),
  });

  useEffect(() => {
    if (!isTimerRunning) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          setIsTimerRunning(false);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  function reviewAnswer() {
    const review = summarizePracticeAnswer(draftAnswer);
    const nextFeedbackResult = createRuleBasedFeedback(roleplay, draftAnswer, review, activePromptVariant);
    const nextFollowUp = createAdaptiveFollowUpPrompt(roleplay, draftAnswer, review);

    setAnswerReview(review);
    setFeedbackResult(nextFeedbackResult);
    setAdaptiveFollowUp(nextFollowUp);
    setShowFeedback(review.isReadyForFeedback);
    setFollowUpAnswer('');
    setFollowUpReview(null);
    setSavedSession(null);
  }

  function updateFollowUpAnswer(answer: string) {
    setFollowUpAnswer(answer);
    setFollowUpReview(null);
    setSavedSession(null);
  }

  function reviewFollowUpAnswer() {
    const review = summarizePracticeAnswer(followUpAnswer);

    setFollowUpReview(review);
    setSavedSession(null);
  }

  function toggleFocusTimer() {
    if (timerSeconds === 0) {
      setTimerSeconds(FOCUS_SESSION_SECONDS);
    }

    setIsTimerRunning((running) => !running);
  }

  function resetFocusTimer() {
    setIsTimerRunning(false);
    setTimerSeconds(FOCUS_SESSION_SECONDS);
  }

  function selectRoleplay(roleplayId: RoleplayId) {
    setIsScenarioPickerOpen(false);
    onSelectRoleplay(roleplayId);
  }

  function selectPromptVariant(variantId: string) {
    setIsAnglePickerOpen(false);
    setActivePromptVariantId(variantId);
    clearAnswer();
  }

  function clearAnswer() {
    setDraftAnswer('');
    setAnswerReview(null);
    setFeedbackResult(null);
    setShowFeedback(false);
    setSavedSession(null);
    setIsWritingSupportOpen(false);
    setIsAnswerPlanOpen(false);
    setFollowUpAnswer('');
    setFollowUpReview(null);
    setAdaptiveFollowUp(null);
    resetFocusTimer();
  }

  function toggleWritingSupport() {
    if (isWritingSupportOpen) {
      setIsAnswerPlanOpen(false);
    }

    setIsWritingSupportOpen((isOpen) => !isOpen);
  }

  function saveSession() {
    if (!answerReview?.isReadyForFeedback || !feedbackResult) {
      return;
    }

    const savedAnswer = followUpReview?.isReadyForFeedback
      ? `${draftAnswer.trim()} Follow-up: ${followUpAnswer.trim()}`
      : draftAnswer;

    const session = createPracticeSession({
      answer: savedAnswer,
      feedback: feedbackResult.feedback,
      review: answerReview,
      roleplay,
      xpReward: totalXpReward,
    });

    setSavedSession(session);
    setIsTimerRunning(false);
    onSaveSession(session);
  }

  function startRecommendedPractice() {
    if (!nextPracticeRecommendation) {
      return;
    }

    clearAnswer();
    onSelectRoleplay(nextPracticeRecommendation.roleplayId);
  }

  return (
    <Screen
      title={roleplay.title}
      subtitle="Follow the steps: read, answer, review and save."
    >
      <Card muted>
        <View style={styles.guideHeader}>
          <View style={styles.guideTitleBlock}>
            <Text style={styles.detailLabel}>Guided practice</Text>
            <Text style={styles.guideTitle}>{roleplayGuide.activeLabel}</Text>
          </View>
        </View>
        <Text style={styles.guideInstruction}>{roleplayGuide.activeInstruction}</Text>
        <View style={styles.guideSteps}>
          {roleplayGuide.steps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.guideStep,
                step.status === 'active' && styles.guideStepActive,
                step.status === 'done' && styles.guideStepDone,
              ]}
            >
              <Text
                style={[
                  styles.guideStepNumber,
                  step.status === 'active' && styles.guideStepNumberActive,
                  step.status === 'done' && styles.guideStepNumberDone,
                ]}
              >
                {index + 1}
              </Text>
              <Text
                style={[
                  styles.guideStepText,
                  step.status === 'active' && styles.guideStepTextActive,
                  step.status === 'done' && styles.guideStepTextDone,
                ]}
              >
                {step.title}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.guideTimerPanel}>
          <View style={styles.guideTimerRow}>
            <View style={styles.guideTimerCopyBlock}>
              <Text style={styles.guideTimerTitle}>{timerControls.title}</Text>
              <Text style={styles.guideTimerCopy}>{timerControls.caption}</Text>
            </View>
            <View style={styles.guideTimerActions}>
              <Text style={styles.guideTimerValue}>{formatFocusTime(timerSeconds)}</Text>
              <Pressable
                accessibilityHint="Starts, pauses or restarts the five-minute focus timer"
                accessibilityLabel={timerControls.primaryAccessibilityLabel}
                accessibilityRole="button"
                onPress={toggleFocusTimer}
                style={({ pressed }) => [styles.guideTimerButton, pressed && styles.guideTimerButtonPressed]}
              >
                <Text style={styles.guideTimerButtonText}>{timerControls.primaryLabel}</Text>
              </Pressable>
            </View>
          </View>
          {timerControls.showReset ? (
            <Pressable
              accessibilityHint="Resets the focus timer back to five minutes"
              accessibilityLabel={timerControls.resetAccessibilityLabel}
              accessibilityRole="button"
              onPress={resetFocusTimer}
              style={({ pressed }) => [styles.guideTimerResetButton, pressed && styles.guideTimerButtonPressed]}
            >
              <Text style={styles.guideTimerResetText}>{timerControls.resetLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </Card>

      <View style={styles.scenarioPanel}>
        <View style={styles.scenarioSummary}>
          <View style={styles.scenarioCopyBlock}>
            <Text style={styles.detailLabel}>{scenarioPicker.eyebrow}</Text>
            <Text style={styles.scenarioTitle}>{scenarioPicker.currentScenario.title}</Text>
            <Text style={styles.scenarioMeta}>
              {formatRoleplayScenarioMeta(scenarioPicker.currentScenario)}
            </Text>
          </View>
          <Pressable
            accessibilityHint="Shows or hides the other roleplay scenario choices"
            accessibilityLabel={scenarioPicker.toggleAccessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{ expanded: isScenarioPickerOpen }}
            onPress={() => setIsScenarioPickerOpen((isOpen) => !isOpen)}
            style={({ pressed }) => [styles.scenarioToggle, pressed && styles.scenarioTogglePressed]}
          >
            <Text style={styles.scenarioToggleText}>{scenarioPicker.toggleLabel}</Text>
          </Pressable>
        </View>
        {isScenarioPickerOpen ? (
          <>
            {scenarioPicker.showHelperText ? (
              <Text style={styles.scenarioHelper}>{scenarioPicker.helperText}</Text>
            ) : null}
            <View style={styles.scenarioChoices}>
              {scenarioPicker.options.map((item) => (
                <Pressable
                  accessibilityHint="Switches the active roleplay scenario"
                  accessibilityLabel={`Open ${item.title} roleplay`}
                  accessibilityRole="button"
                  key={item.id}
                  onPress={() => selectRoleplay(item.id)}
                  style={({ pressed }) => [styles.scenarioChoice, pressed && styles.scenarioChoicePressed]}
                >
                  <Text style={styles.scenarioChoiceTitle}>{item.title}</Text>
                  <Text style={styles.scenarioChoiceMeta}>{formatRoleplayScenarioMeta(item)}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
      </View>

      {roleplayPromptVariants.length > 0 && anglePicker.currentAngle ? (
        <Card>
          <View style={styles.angleHeader}>
            <View style={styles.angleCopyBlock}>
              <Text style={styles.detailLabel}>{anglePicker.eyebrow}</Text>
              <Text style={styles.angleTitle}>{anglePicker.currentAngle.title}</Text>
            </View>
            {anglePicker.options.length > 0 ? (
              <Pressable
                accessibilityHint="Shows or hides the other practice angles for this roleplay"
                accessibilityLabel={anglePicker.toggleAccessibilityLabel}
                accessibilityRole="button"
                accessibilityState={{ expanded: isAnglePickerOpen }}
                onPress={() => setIsAnglePickerOpen((isOpen) => !isOpen)}
                style={({ pressed }) => [styles.angleToggle, pressed && styles.angleTogglePressed]}
              >
                <Text style={styles.angleToggleText}>{anglePicker.toggleLabel}</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.angleNote}>{anglePicker.currentAngle.coachingNote}</Text>
          {isAnglePickerOpen ? (
            <>
              {anglePicker.showHelperText ? (
                <Text style={styles.angleHelper}>{anglePicker.helperText}</Text>
              ) : null}
              <View style={styles.angleOptions}>
                {anglePicker.options.map((variant) => (
                  <Pressable
                    accessibilityHint="Changes the opening prompt and clears the current draft answer"
                    accessibilityLabel={`Use ${variant.title} practice angle`}
                    accessibilityRole="button"
                    key={variant.id}
                    onPress={() => selectPromptVariant(variant.id)}
                    style={({ pressed }) => [styles.angleOption, pressed && styles.angleOptionPressed]}
                  >
                    <Text style={styles.angleOptionTitle}>{variant.title}</Text>
                    <Text style={styles.angleOptionNote}>{variant.coachingNote}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </Card>
      ) : null}

      <Card muted>
        <Text style={styles.detailLabel}>{readCard.eyebrow}</Text>
        <Text style={styles.readTitle}>{readCard.focus}</Text>
        <Text style={styles.readDescription}>{readCard.description}</Text>
        <View style={styles.readChecklist}>
          {readCard.details.map((detail, index) => (
            <View key={detail.label} style={styles.readChecklistItem}>
              <View style={styles.readChecklistNumber}>
                <Text style={styles.readChecklistNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.readChecklistCopy}>
                <Text style={styles.readChecklistLabel}>{detail.label}</Text>
                <Text style={styles.readChecklistText}>{detail.text}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.readOpeningBlock}>
          <Text style={styles.readOpeningLabel}>{readCard.openingLabel}</Text>
          <Text style={styles.readOpeningLine}>
            <Text style={styles.readOpeningSpeaker}>{readCard.openingSpeaker}: </Text>
            {readCard.openingLine}
          </Text>
        </View>
      </Card>

      <Card>
        <View style={styles.answerHeader}>
          <View style={styles.answerTitleBlock}>
            <Text style={styles.detailLabel}>Step 2</Text>
            <Text style={styles.answerTitle}>{answerCoach.title}</Text>
          </View>
          <View style={styles.answerTargetPill}>
            <Text style={styles.answerTargetText}>{answerCoach.wordTargetLabel}</Text>
          </View>
        </View>
        <Text style={styles.answerInstruction}>{answerCoach.instruction}</Text>
        <View style={styles.writingSupportBlock}>
          <View style={styles.writingSupportHeader}>
            <View style={styles.writingSupportCopy}>
              <Text style={styles.writingSupportTitle}>{writingSupport.title}</Text>
              <Text style={styles.writingSupportSummary}>{writingSupport.summaryLabel}</Text>
            </View>
            <Pressable
              accessibilityHint="Shows or hides extra writing support for this answer"
              accessibilityLabel={writingSupport.toggleAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={{ expanded: isWritingSupportOpen }}
              onPress={toggleWritingSupport}
              style={({ pressed }) => [
                styles.writingSupportToggle,
                isWritingSupportOpen && styles.writingSupportToggleActive,
                pressed && styles.writingSupportTogglePressed,
              ]}
            >
              <Text
                style={[
                  styles.writingSupportToggleText,
                  isWritingSupportOpen && styles.writingSupportToggleTextActive,
                ]}
              >
                {writingSupport.toggleLabel}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.writingSupportHelper}>{writingSupport.helperText}</Text>
          <View style={styles.quickStartBlock}>
            <Text style={styles.quickStartLabel}>{writingSupport.quickStartLabel}</Text>
            <Text style={styles.quickStartText}>{writingSupport.quickStartText}</Text>
          </View>
          {isWritingSupportOpen ? (
            <>
              {extraSuggestedPhrases.length > 0 ? (
                <View style={styles.inlinePhraseList}>
                  {extraSuggestedPhrases.map((phrase) => (
                    <View key={phrase} style={styles.inlinePhraseChip}>
                      <Text style={styles.inlinePhraseText}>{phrase}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={styles.nestedPlanBlock}>
                <View style={styles.nestedPlanHeader}>
                  <View style={styles.nestedPlanCopy}>
                    <Text style={styles.nestedPlanTitle}>{answerPlan.title}</Text>
                    <Text style={styles.nestedPlanSummary}>{answerPlan.stepCountLabel}</Text>
                  </View>
                  <Pressable
                    accessibilityHint="Shows or hides the answer structure checklist"
                    accessibilityLabel={answerPlan.toggleAccessibilityLabel}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isAnswerPlanOpen }}
                    onPress={() => setIsAnswerPlanOpen((isOpen) => !isOpen)}
                    style={({ pressed }) => [
                      styles.writingSupportToggle,
                      styles.nestedPlanToggle,
                      isAnswerPlanOpen && styles.writingSupportToggleActive,
                      pressed && styles.writingSupportTogglePressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.writingSupportToggleText,
                        isAnswerPlanOpen && styles.writingSupportToggleTextActive,
                      ]}
                    >
                      {answerPlan.toggleLabel}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.nestedPlanHelper}>{answerPlan.helperText}</Text>
                {isAnswerPlanOpen ? (
                  <View style={styles.answerChecklist}>
                    {answerPlan.steps.map((item, index) => (
                      <View key={item} style={styles.answerChecklistItem}>
                        <View style={styles.answerChecklistNumber}>
                          <Text style={styles.answerChecklistNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.answerChecklistText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </>
          ) : null}
        </View>
        <View style={styles.answerInputHeader}>
          <Text style={styles.answerInputHeaderTitle}>{answerCoach.transitionTitle}</Text>
          <Text style={styles.answerInputHeaderBody}>{answerCoach.transitionBody}</Text>
        </View>
        <TextInput
          accessibilityLabel="Practice answer"
          accessibilityHint="Write your first spoken-style response to the roleplay prompt"
          multiline
          onBlur={() => setIsAnswerFocused(false)}
          onChangeText={setDraftAnswer}
          onFocus={() => setIsAnswerFocused(true)}
          placeholder={answerCoach.placeholder}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.answerInput,
            (isAnswerFocused || draftAnswer.trim().length > 0) && styles.answerInputActive,
          ]}
          textAlignVertical="top"
          value={draftAnswer}
        />
        {answerReview ? (
          <View style={styles.answerReview}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewLabel}>{answerReview.readinessLabel}</Text>
              <Text style={styles.wordCount}>{answerReview.wordCount} words</Text>
            </View>
            <Text style={styles.reviewNote}>{answerReview.reviewNote}</Text>
            {feedbackResult ? (
              <View style={styles.rewardRow}>
                <Text style={styles.rewardValue}>+{feedbackResult.xpReward} XP</Text>
                <Text style={styles.rewardLabel}>{feedbackResult.rewardLabel}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <View style={styles.answerActions}>
          <AppButton
            accessibilityHint="Reviews your first answer with local mock feedback"
            label={answerCoach.reviewCtaLabel}
            onPress={reviewAnswer}
          />
          <View style={styles.answerClearAction}>
            <AppButton
              accessibilityHint="Clears the current answer, feedback and timer"
              label="Clear"
              onPress={clearAnswer}
              variant="secondary"
            />
          </View>
        </View>
      </Card>

      {completionSummary ? (
        <Card muted>
          <View style={styles.completionHeader}>
            <View style={styles.completionTitleBlock}>
              <Text style={styles.completionEyebrow}>Session complete</Text>
              <Text style={styles.completionTitle}>{completionSummary.title}</Text>
            </View>
            <View style={styles.completionXpPill}>
              <Text style={styles.completionXp}>+{totalXpReward}</Text>
              <Text style={styles.completionXpLabel}>XP</Text>
            </View>
          </View>
          <Text style={styles.completionBody}>{completionSummary.body}</Text>
          <View style={styles.completionStats}>
            <View style={styles.completionStat}>
              <Text style={styles.completionStatLabel}>Reward</Text>
              <Text style={styles.completionStatValue}>{completionSummary.rewardLabel}</Text>
            </View>
            <View style={[styles.completionStat, styles.completionStatSecondary]}>
              <Text style={styles.completionStatLabel}>Today</Text>
              <Text style={styles.completionStatValue}>
                {completionMilestone ? completionMilestone.todayValue : 'Saved'}
              </Text>
            </View>
          </View>
          {completionMilestone ? (
            <View style={styles.completionMilestone}>
              <View style={styles.completionMilestoneHeader}>
                <Text style={styles.completionMilestoneTitle}>{completionMilestone.title}</Text>
                <Text style={styles.completionMilestoneValue}>{completionMilestone.streakValue}</Text>
              </View>
              <Text style={styles.completionMilestoneBody}>{completionMilestone.body}</Text>
            </View>
          ) : null}
          <Text style={styles.completionNext}>{completionSummary.nextAction}</Text>
          {nextPracticeRecommendation ? (
            <View style={styles.recommendationPanel}>
              <Text style={styles.recommendationLabel}>Recommended next</Text>
              <Text style={styles.recommendationTitle}>{nextPracticeRecommendation.title}</Text>
              <Text style={styles.recommendationReason}>{nextPracticeRecommendation.reason}</Text>
            </View>
          ) : null}
          <View style={styles.completionAction}>
            {nextPracticeRecommendation ? (
              <AppButton
                accessibilityHint={`Opens ${nextPracticeRecommendation.title} as the next practice scenario`}
                accessibilityLabel={`Start ${nextPracticeRecommendation.title}`}
                label={nextPracticeRecommendation.ctaLabel}
                onPress={startRecommendedPractice}
              />
            ) : null}
            <View style={nextPracticeRecommendation ? styles.completionSecondaryAction : undefined}>
              <AppButton
                accessibilityHint="Opens Progress to review saved sessions and mistake bank"
                label={completionSummary.progressCtaLabel}
                onPress={onOpenProgress}
                variant="secondary"
              />
            </View>
            <View style={styles.completionSecondaryAction}>
              <Pressable
                accessibilityHint="Clears this completed session and starts a fresh answer"
                accessibilityLabel="Practice another answer"
                accessibilityRole="button"
                onPress={clearAnswer}
                style={({ pressed }) => [
                  styles.completionTertiaryAction,
                  pressed && styles.completionTertiaryActionPressed,
                ]}
              >
                <Text style={styles.completionTertiaryActionText}>Practice another answer</Text>
              </Pressable>
            </View>
          </View>
        </Card>
      ) : null}

      {showFeedback && feedbackResult ? <FeedbackPanel feedback={feedbackResult.feedback} /> : null}

      {showFeedback && adaptiveFollowUp ? (
        <Card>
          <Text style={styles.detailLabel}>Follow-up round</Text>
          <View style={styles.followUpFocusPill}>
            <Text style={styles.followUpFocusText}>{adaptiveFollowUp.focusLabel}</Text>
          </View>
          <Text style={styles.followUpPersona}>{roleplay.aiPersona} asks</Text>
          <Text style={styles.followUpPrompt}>{adaptiveFollowUp.prompt}</Text>
          <Text style={styles.followUpCoach}>{adaptiveFollowUp.coachingNote}</Text>
          <TextInput
            accessibilityLabel="Follow-up answer"
            accessibilityHint="Write your response to the follow-up roleplay question"
            multiline
            onChangeText={updateFollowUpAnswer}
            placeholder="Write your follow-up response..."
            placeholderTextColor={colors.textMuted}
            style={styles.followUpInput}
            textAlignVertical="top"
            value={followUpAnswer}
          />
          {followUpReview ? (
            <View style={styles.answerReview}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewLabel}>{followUpReview.readinessLabel}</Text>
                <Text style={styles.wordCount}>{followUpReview.wordCount} words</Text>
              </View>
              <Text style={styles.reviewNote}>{followUpReview.reviewNote}</Text>
              {followUpReview.isReadyForFeedback ? (
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardValue}>+15 XP</Text>
                  <Text style={styles.rewardLabel}>Follow-up bonus</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <View style={styles.followUpAction}>
            <AppButton
              accessibilityHint="Reviews your follow-up answer for readiness"
              label="Review follow-up"
              onPress={reviewFollowUpAnswer}
              variant="quiet"
            />
          </View>
        </Card>
      ) : null}

      {savePrompt ? (
        <Card muted>
          <View style={styles.lessonSaveHeader}>
            <View style={styles.lessonSaveTitleBlock}>
              <Text style={styles.lessonSaveEyebrow}>{savePrompt.eyebrow}</Text>
              <Text style={styles.lessonSaveTitle}>{savePrompt.title}</Text>
            </View>
            <View style={styles.lessonSaveXpPill}>
              <Text style={styles.lessonSaveXp}>{savePrompt.xpLabel}</Text>
            </View>
          </View>
          <Text style={styles.lessonSaveBody}>{savePrompt.body}</Text>
          <View style={styles.lessonSaveStatusRow}>
            <View style={styles.lessonSaveStatusPill}>
              <Text style={styles.lessonSaveStatusText}>Feedback reviewed</Text>
            </View>
            <View style={[styles.lessonSaveStatusPill, styles.lessonSaveStatusSecondary]}>
              <Text style={styles.lessonSaveStatusText}>{savePrompt.followUpLabel}</Text>
            </View>
          </View>
          <View style={styles.lessonSaveAction}>
            <AppButton
              accessibilityHint="Saves this practice session to Progress"
              label={savePrompt.ctaLabel}
              onPress={saveSession}
            />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  guideHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  guideTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  guideTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  guideInstruction: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  guideSteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
  guideStep: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  guideStepActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  guideStepDone: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BDE7DC',
  },
  guideStepNumber: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    marginRight: spacing.xs,
  },
  guideStepNumberActive: {
    color: colors.surface,
  },
  guideStepNumberDone: {
    color: colors.primaryDark,
  },
  guideStepText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  guideStepTextActive: {
    color: colors.surface,
  },
  guideStepTextDone: {
    color: colors.primaryDark,
  },
  guideTimerPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  guideTimerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  guideTimerCopyBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  guideTimerTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  guideTimerCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: 18,
  },
  guideTimerValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    minWidth: 42,
    textAlign: 'right',
  },
  guideTimerActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  guideTimerButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    minHeight: 36,
    minWidth: 76,
    paddingHorizontal: spacing.md,
  },
  guideTimerResetButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 28,
    paddingHorizontal: spacing.sm,
  },
  guideTimerButtonPressed: {
    opacity: 0.82,
  },
  guideTimerButtonText: {
    color: colors.surface,
    fontSize: typography.small,
    fontWeight: '900',
  },
  guideTimerResetText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  scenarioPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  scenarioSummary: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  scenarioCopyBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  scenarioTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  scenarioMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  scenarioToggle: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  scenarioTogglePressed: {
    opacity: 0.82,
  },
  scenarioToggleText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  scenarioHelper: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  scenarioChoices: {
    marginTop: spacing.md,
  },
  scenarioChoice: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  scenarioChoicePressed: {
    opacity: 0.82,
  },
  scenarioChoiceTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  scenarioChoiceMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  readTitle: {
    color: colors.primaryDark,
    fontSize: typography.h3,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  readDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  readChecklist: {
    marginTop: spacing.md,
  },
  readChecklistItem: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flexDirection: 'row',
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  readChecklistNumber: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 26,
  },
  readChecklistNumberText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  readChecklistCopy: {
    flex: 1,
  },
  readChecklistLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  readChecklistText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  detailLabel: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  readOpeningBlock: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  readOpeningLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  readOpeningLine: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  readOpeningSpeaker: {
    color: colors.ink,
    fontWeight: '900',
  },
  angleHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  angleCopyBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  angleTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  angleToggle: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  angleTogglePressed: {
    opacity: 0.82,
  },
  angleToggleText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  angleNote: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  angleHelper: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  angleOptions: {
    marginTop: spacing.md,
  },
  angleOption: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  angleOptionPressed: {
    opacity: 0.82,
  },
  angleOptionTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  angleOptionNote: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  answerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  answerTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  answerTargetPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  answerTargetText: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
  },
  answerInstruction: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  writingSupportBlock: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  writingSupportHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  writingSupportCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  writingSupportTitle: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  writingSupportSummary: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  writingSupportToggle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  writingSupportToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  writingSupportTogglePressed: {
    opacity: 0.82,
  },
  writingSupportToggleText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  writingSupportToggleTextActive: {
    color: colors.surface,
  },
  writingSupportHelper: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  quickStartBlock: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  quickStartLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  quickStartText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  nestedPlanBlock: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  nestedPlanHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  nestedPlanCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  nestedPlanTitle: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  nestedPlanSummary: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  nestedPlanToggle: {
    minWidth: 64,
  },
  nestedPlanHelper: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  answerChecklist: {
    marginTop: spacing.sm,
  },
  answerChecklistItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  answerChecklistNumber: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 26,
  },
  answerChecklistNumberText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  answerChecklistText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: 19,
  },
  inlinePhraseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  inlinePhraseChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inlinePhraseText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
  answerInputHeader: {
    marginTop: spacing.md,
  },
  answerInputHeaderTitle: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '900',
  },
  answerInputHeaderBody: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  answerInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
    minHeight: 132,
    padding: spacing.md,
  },
  answerInputActive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  followUpPersona: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  followUpFocusPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  followUpFocusText: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
  },
  followUpPrompt: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: 23,
    marginTop: spacing.xs,
  },
  followUpCoach: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  followUpInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
    minHeight: 104,
    padding: spacing.md,
  },
  followUpAction: {
    marginTop: spacing.md,
  },
  answerReview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '900',
  },
  wordCount: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  reviewNote: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  rewardRow: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rewardValue: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '900',
  },
  rewardLabel: {
    color: colors.textMuted,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '800',
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  answerActions: {
    marginTop: spacing.md,
  },
  answerClearAction: {
    marginTop: spacing.sm,
  },
  lessonSaveHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lessonSaveTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  lessonSaveEyebrow: {
    color: colors.success,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  lessonSaveTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  lessonSaveXpPill: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    minWidth: 78,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lessonSaveXp: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '900',
  },
  lessonSaveBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  lessonSaveStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  lessonSaveStatusPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lessonSaveStatusSecondary: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BDE7DC',
  },
  lessonSaveStatusText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
  },
  lessonSaveAction: {
    marginTop: spacing.sm,
  },
  completionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  completionEyebrow: {
    color: colors.success,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  completionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  completionXpPill: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    minWidth: 76,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  completionXp: {
    color: colors.accent,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  completionXpLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  completionBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  completionStats: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  completionStat: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  completionStatSecondary: {
    marginLeft: spacing.sm,
  },
  completionStatLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  completionStatValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  completionMilestone: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  completionMilestoneHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionMilestoneTitle: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '900',
    paddingRight: spacing.md,
  },
  completionMilestoneValue: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
  },
  completionMilestoneBody: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  completionNext: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: spacing.md,
  },
  recommendationPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  recommendationLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  recommendationTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  recommendationReason: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  completionAction: {
    marginTop: spacing.md,
  },
  completionSecondaryAction: {
    marginTop: spacing.sm,
  },
  completionTertiaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  completionTertiaryActionPressed: {
    opacity: 0.72,
  },
  completionTertiaryActionText: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '900',
  },
});
