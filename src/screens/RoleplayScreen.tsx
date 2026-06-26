import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createAdaptiveFollowUpPrompt, type AdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import { FOCUS_SESSION_SECONDS, formatFocusTime } from '../utils/focusTimer';
import {
  createNextPracticeRecommendation,
  createPracticeCompletionSummary,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
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
      title="Roleplay"
      subtitle="Practice a realistic workplace conversation. AI is mocked until backend integration is ready."
    >
      <View style={styles.selector}>
        {practiceContent.roleplays.map((item) => {
          const isActive = item.id === roleplay.id;

          return (
            <Pressable
              accessibilityHint="Switches the active roleplay scenario"
              accessibilityLabel={`Open ${item.title} roleplay`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              key={item.id}
              onPress={() => onSelectRoleplay(item.id)}
              style={[styles.selectorItem, isActive && styles.selectorItemActive]}
            >
              <Text style={[styles.selectorText, isActive && styles.selectorTextActive]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <Text style={styles.title}>{roleplay.title}</Text>
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
        <View style={styles.timerHeader}>
          <View>
            <Text style={styles.detailLabel}>Focus timer</Text>
            <Text style={styles.timerTitle}>5-minute career sprint</Text>
          </View>
          <View style={styles.timerPill}>
            <Text style={styles.timerValue}>{formatFocusTime(timerSeconds)}</Text>
          </View>
        </View>
        <Text style={styles.timerCopy}>
          Stay in one realistic conversation, write the answer, then review for XP.
        </Text>
        <View style={styles.timerActions}>
          <Pressable
            accessibilityHint="Starts, pauses or restarts the five-minute focus timer"
            accessibilityLabel={
              isTimerRunning ? 'Pause focus timer' : timerSeconds === 0 ? 'Restart focus timer' : 'Start focus timer'
            }
            accessibilityRole="button"
            onPress={toggleFocusTimer}
            style={({ pressed }) => [styles.timerButton, pressed && styles.timerButtonPressed]}
          >
            <Text style={styles.timerButtonText}>
              {isTimerRunning ? 'Pause' : timerSeconds === 0 ? 'Restart' : 'Start'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityHint="Resets the focus timer back to five minutes"
            accessibilityLabel="Reset focus timer"
            accessibilityRole="button"
            onPress={resetFocusTimer}
            style={({ pressed }) => [styles.timerButtonSecondary, pressed && styles.timerButtonPressed]}
          >
            <Text style={styles.timerButtonSecondaryText}>Reset</Text>
          </Pressable>
        </View>
      </Card>

      <Card>
        <Text style={styles.detailLabel}>Useful phrases</Text>
        <View style={styles.phraseList}>
          {activeSuggestedPhrases.map((phrase) => (
            <Text key={phrase} style={styles.phrase}>- {phrase}</Text>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.detailLabel}>Your answer</Text>
        <TextInput
          accessibilityLabel="Practice answer"
          accessibilityHint="Write your first spoken-style response to the roleplay prompt"
          multiline
          onChangeText={setDraftAnswer}
          placeholder="Write your first response here..."
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
      </Card>

      <View style={styles.actions}>
        <AppButton
          accessibilityHint="Reviews your first answer with local mock feedback"
          label="Review answer"
          onPress={reviewAnswer}
        />
        <AppButton
          accessibilityHint="Clears the current answer, feedback and timer"
          label="Clear"
          onPress={clearAnswer}
          variant="secondary"
        />
      </View>
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
              <AppButton
                accessibilityHint="Clears this completed session and starts a fresh answer"
                label="Practice another answer"
                onPress={clearAnswer}
                variant="quiet"
              />
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
  selector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectorItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectorItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectorText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  selectorTextActive: {
    color: colors.surface,
  },
  title: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
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
  timerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  timerPill: {
    alignItems: 'center',
    backgroundColor: colors.infoSoft,
    borderRadius: radii.md,
    minWidth: 86,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timerValue: {
    color: colors.info,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  timerCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  timerActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  timerButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  timerButtonSecondary: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginLeft: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  timerButtonPressed: {
    opacity: 0.82,
  },
  timerButtonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '900',
  },
  timerButtonSecondaryText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  phraseList: {
    marginTop: spacing.sm,
  },
  phrase: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  answerInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
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
  actions: {
    marginTop: spacing.md,
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
});
