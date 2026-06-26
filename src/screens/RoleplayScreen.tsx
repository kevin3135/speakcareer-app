import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';
import { createAnswerCoachContent } from '../utils/answerCoach';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createAdaptiveFollowUpPrompt, type AdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { createFocusTimerControls, FOCUS_SESSION_SECONDS, formatFocusTime } from '../utils/focusTimer';
import {
  createNextPracticeRecommendation,
  createPracticeCompletionSummary,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createRoleplayGuideState } from '../utils/roleplayGuide';
import {
  createRoleplayScenarioPickerState,
  formatRoleplayScenarioMeta,
} from '../utils/roleplayScenarioPicker';
import { createPracticeSession } from '../utils/sessionHistory';

type RoleplayScreenProps = {
  roleplay: RoleplayScenario;
  onOpenProgress: () => void;
  onSelectRoleplay: (roleplayId: RoleplayId) => void;
  onSaveSession: (session: PracticeSession) => void;
};

export function RoleplayScreen({
  onOpenProgress,
  onSaveSession,
  roleplay,
  onSelectRoleplay,
}: RoleplayScreenProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [answerReview, setAnswerReview] = useState<AnswerReview | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<RuleBasedFeedbackResult | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(FOCUS_SESSION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [followUpReview, setFollowUpReview] = useState<AnswerReview | null>(null);
  const [adaptiveFollowUp, setAdaptiveFollowUp] = useState<AdaptiveFollowUpPrompt | null>(null);
  const [isScenarioPickerOpen, setIsScenarioPickerOpen] = useState(false);
  const [activePromptVariantId, setActivePromptVariantId] = useState(
    roleplay.promptVariants?.[0]?.id ?? null,
  );

  const roleplayPromptVariants = roleplay.promptVariants ?? [];
  const activePromptVariant =
    roleplayPromptVariants.find((variant) => variant.id === activePromptVariantId) ??
    roleplayPromptVariants[0];
  const activeUserGoal = activePromptVariant?.userGoal ?? roleplay.userGoal;
  const activeOpeningLine = activePromptVariant?.openingLine ?? roleplay.openingLine;
  const activeSuggestedPhrases = activePromptVariant?.suggestedPhrases ?? roleplay.suggestedPhrases;
  const answerCoach = createAnswerCoachContent({ persona: roleplay.aiPersona });
  const timerControls = createFocusTimerControls({
    isRunning: isTimerRunning,
    secondsRemaining: timerSeconds,
  });
  const scenarioPicker = createRoleplayScenarioPickerState({
    activeRoleplayId: roleplay.id,
    isOpen: isScenarioPickerOpen,
    roleplays: practiceContent.roleplays,
  });
  const followUpBonusXp = followUpReview?.isReadyForFeedback ? 15 : 0;
  const totalXpReward = (feedbackResult?.xpReward ?? 0) + followUpBonusXp;
  const completionSummary = savedSessionId
    ? createPracticeCompletionSummary({
        includedFollowUp: Boolean(followUpReview?.isReadyForFeedback),
        roleplayTitle: roleplay.title,
        xpReward: totalXpReward,
      })
    : null;
  const nextPracticeRecommendation = completionSummary
    ? createNextPracticeRecommendation(roleplay.id, practiceContent.roleplays)
    : null;
  const roleplayGuide = createRoleplayGuideState({
    hasDraftAnswer: draftAnswer.trim().length > 0,
    hasReviewedAnswer: Boolean(answerReview),
    isReadyForFeedback: Boolean(answerReview?.isReadyForFeedback && feedbackResult),
    isSaved: Boolean(savedSessionId),
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
    setSavedSessionId(null);
  }

  function updateFollowUpAnswer(answer: string) {
    setFollowUpAnswer(answer);
    setFollowUpReview(null);
    setSavedSessionId(null);
  }

  function reviewFollowUpAnswer() {
    const review = summarizePracticeAnswer(followUpAnswer);

    setFollowUpReview(review);
    setSavedSessionId(null);
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
    setActivePromptVariantId(variantId);
    clearAnswer();
  }

  function clearAnswer() {
    setDraftAnswer('');
    setAnswerReview(null);
    setFeedbackResult(null);
    setShowFeedback(false);
    setSavedSessionId(null);
    setFollowUpAnswer('');
    setFollowUpReview(null);
    setAdaptiveFollowUp(null);
    resetFocusTimer();
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

    setSavedSessionId(session.id);
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
          <View style={styles.guideTimerHeader}>
            <View style={styles.guideTimerCopyBlock}>
              <Text style={styles.guideTimerTitle}>{timerControls.title}</Text>
              <Text style={styles.guideTimerCopy}>{timerControls.description}</Text>
            </View>
            <Text style={styles.guideTimerValue}>{formatFocusTime(timerSeconds)}</Text>
          </View>
          <View style={styles.guideTimerActions}>
            <Pressable
              accessibilityHint="Starts, pauses or restarts the five-minute focus timer"
              accessibilityLabel={timerControls.primaryAccessibilityLabel}
              accessibilityRole="button"
              onPress={toggleFocusTimer}
              style={({ pressed }) => [styles.guideTimerButton, pressed && styles.guideTimerButtonPressed]}
            >
              <Text style={styles.guideTimerButtonText}>{timerControls.primaryLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityHint="Resets the focus timer back to five minutes"
              accessibilityLabel={timerControls.resetAccessibilityLabel}
              accessibilityRole="button"
              onPress={resetFocusTimer}
              style={({ pressed }) => [styles.guideTimerResetButton, pressed && styles.guideTimerButtonPressed]}
            >
              <Text style={styles.guideTimerResetText}>{timerControls.resetLabel}</Text>
            </Pressable>
          </View>
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
        ) : (
          <Text style={styles.scenarioHelper}>{scenarioPicker.helperText}</Text>
        )}
      </View>

      <Card>
        <Text style={styles.detailLabel}>Current prompt</Text>
        <Text style={styles.focus}>{roleplay.focus}</Text>
        <Text style={styles.description}>{roleplay.description}</Text>

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Context</Text>
          <Text style={styles.detailText}>{roleplay.workplaceContext}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Your goal</Text>
          <Text style={styles.detailText}>{activeUserGoal}</Text>
        </View>
      </Card>

      {roleplayPromptVariants.length > 0 ? (
        <Card>
          <Text style={styles.detailLabel}>Practice angle</Text>
          <View style={styles.variantList}>
            {roleplayPromptVariants.map((variant) => {
              const isActive = variant.id === activePromptVariant?.id;

              return (
                <Pressable
                  accessibilityHint="Changes the opening prompt and clears the current draft answer"
                  accessibilityLabel={`Use ${variant.title} practice angle`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  key={variant.id}
                  onPress={() => selectPromptVariant(variant.id)}
                  style={[styles.variantChip, isActive && styles.variantChipActive]}
                >
                  <Text style={[styles.variantChipText, isActive && styles.variantChipTextActive]}>
                    {variant.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {activePromptVariant ? (
            <Text style={styles.variantNote}>{activePromptVariant.coachingNote}</Text>
          ) : null}
        </Card>
      ) : null}

      <Card muted>
        <Text style={styles.detailLabel}>{roleplay.aiPersona} opens with</Text>
        <Text style={styles.openingLine}>{activeOpeningLine}</Text>
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
        <View style={styles.answerChecklist}>
          {answerCoach.checklist.map((item, index) => (
            <View key={item} style={styles.answerChecklistItem}>
              <View style={styles.answerChecklistNumber}>
                <Text style={styles.answerChecklistNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.answerChecklistText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.inlinePhraseBlock}>
          <Text style={styles.inlinePhraseLabel}>{answerCoach.phraseLabel}</Text>
          <View style={styles.inlinePhraseList}>
            {activeSuggestedPhrases.map((phrase) => (
              <View key={phrase} style={styles.inlinePhraseChip}>
                <Text style={styles.inlinePhraseText}>{phrase}</Text>
              </View>
            ))}
          </View>
        </View>
        <TextInput
          accessibilityLabel="Practice answer"
          accessibilityHint="Write your first spoken-style response to the roleplay prompt"
          multiline
          onChangeText={setDraftAnswer}
          placeholder={answerCoach.placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.answerInput}
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
              <Text style={styles.completionStatLabel}>Saved in</Text>
              <Text style={styles.completionStatValue}>Progress</Text>
            </View>
          </View>
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

      {answerReview?.isReadyForFeedback && !savedSessionId ? (
        <View style={styles.finalSaveAction}>
          <AppButton
            accessibilityHint="Saves this practice session to Progress"
            label={`Save full session (+${totalXpReward} XP)`}
            onPress={saveSession}
          />
        </View>
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
    padding: spacing.md,
  },
  guideTimerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.md,
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
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  guideTimerValue: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  guideTimerActions: {
    flexDirection: 'row',
  },
  guideTimerButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  guideTimerResetButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    minHeight: 40,
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
    color: colors.text,
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
  focus: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  detailBlock: {
    marginTop: spacing.lg,
  },
  detailLabel: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  detailText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  openingLine: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
    lineHeight: 28,
  },
  variantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  variantChip: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  variantChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  variantChipText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '900',
  },
  variantChipTextActive: {
    color: colors.surface,
  },
  variantNote: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.sm,
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
  answerChecklist: {
    marginTop: spacing.md,
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
  inlinePhraseBlock: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  inlinePhraseLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  inlinePhraseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  finalSaveAction: {
    marginTop: spacing.md,
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
