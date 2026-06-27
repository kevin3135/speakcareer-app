import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  ScreenContainer,
  XPBadge,
} from '../components/ui';
import { practiceContent } from '../data/content';
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
import { createAdaptiveFollowUpPrompt } from '../utils/followUpPrompt';
import {
  createNextPracticeRecommendation,
  createPracticeCompletionSummary,
  createPracticeSavePrompt,
  createSavedRoleplayHandoff,
} from '../utils/practiceCompletion';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createPracticeSession } from '../utils/sessionHistory';
import { getStartingLevelProfile } from '../utils/startingLevel';

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

export function RoleplayScreen({
  onBack,
  onOpenProgress,
  onSaveSession,
  roleplay,
  onSelectRoleplay,
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
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isAnswerFocused, setIsAnswerFocused] = useState(false);

  const activeVariant = roleplay.promptVariants?.[0];
  const openingLine = activeVariant?.openingLine ?? roleplay.openingLine;
  const baseXpReward = feedbackResult?.xpReward ?? roleplay.durationMinutes * 4;
  const nextRecommendation = createNextPracticeRecommendation(roleplay.id, practiceContent.roleplays);
  const followUpReview = followUpAnswer.trim().length > 0
    ? summarizePracticeAnswer(followUpAnswer)
    : null;
  const includedFollowUp = Boolean(followUpReview?.isReadyForFeedback);
  const totalXpReward = baseXpReward + (includedFollowUp ? FOLLOW_UP_BONUS_XP : 0);
  const savedHandoff = createSavedRoleplayHandoff({
    nextPracticeRecommendation: nextRecommendation,
    xpReward: savedSession?.xpReward ?? totalXpReward,
  });
  const savedSummary = savedSession
    ? createPracticeCompletionSummary({
      includedFollowUp: savedSession.includedFollowUp,
      roleplayTitle: savedSession.roleplayTitle,
      xpReward: savedSession.xpReward,
    })
    : null;
  const levelProfile = getStartingLevelProfile(startingLevelId);
  const isReviewStep = Boolean(feedbackResult);
  const hasDraftAnswer = draftAnswer.trim().length > 0;
  const shouldPulseAnswer = !isReviewStep && !hasDraftAnswer && !isAnswerFocused;
  const followUpPrompt = answerReview?.isReadyForFeedback
    ? createAdaptiveFollowUpPrompt(roleplay, draftAnswer, answerReview)
    : null;
  const savePrompt = answerReview?.isReadyForFeedback
    ? createPracticeSavePrompt({
      includedFollowUp,
      xpReward: totalXpReward,
    })
    : null;
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
    setIsFollowUpOpen(false);
    setSavedSession(null);
  }

  function retryAnswer() {
    setFeedbackResult(null);
    setAnswerReview(null);
    setFollowUpAnswer('');
    setIsFollowUpOpen(false);
    setSavedSession(null);
    answerInputRef.current?.focus();
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

    setSavedSession(session);
    onSaveSession(session);
  }

  function continueToNext() {
    if (nextRecommendation) {
      onSelectRoleplay(nextRecommendation.roleplayId);
      return;
    }

    onOpenProgress();
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
            <Badge label="Streak updated" tone="accent" />
            {savedSession.includedFollowUp ? <Badge label="Follow-up saved" tone="secondary" /> : null}
          </View>
          <View style={styles.savedNextStep}>
            <Text style={styles.savedNextLabel}>{savedHandoff.nextLabel}</Text>
            <Text style={styles.savedNextTitle}>{savedHandoff.nextTitle}</Text>
          </View>
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
              label="Check answer"
              onPress={reviewAnswer}
            />
          </View>
        </Card>
      ) : null}

      {feedbackResult ? (
        <Card tone="strong">
          <View style={styles.oneThingHeader}>
            <Text style={styles.cardKicker}>Coach says</Text>
            <XPBadge label={`+${baseXpReward} XP`} />
          </View>
          <Text style={styles.cardTitle}>{answerReview?.readinessLabel ?? 'Good start'}</Text>
          <View style={styles.betterEnglishBox}>
            <Text style={styles.betterEnglishLabel}>Better English</Text>
            <Text style={styles.betterEnglishText}>{feedbackResult.feedback.suggestedRewrite}</Text>
          </View>
          <View style={styles.feedbackActions}>
            <View style={styles.feedbackActionItem}>
              <AppButton
                label={answerReview?.isReadyForFeedback ? 'Try again' : 'Add more first'}
                onPress={retryAnswer}
                variant="secondary"
              />
            </View>
          </View>
        </Card>
      ) : null}

      {feedbackResult && answerReview?.isReadyForFeedback && savePrompt ? (
        <Card tone="accent">
          <View style={styles.oneThingHeader}>
            <Text style={styles.cardKicker}>{savePrompt.eyebrow}</Text>
            <Badge
              label={savePrompt.followUpLabel}
              tone={includedFollowUp ? 'success' : 'info'}
            />
          </View>
          <Text style={styles.cardTitle}>{savePrompt.title}</Text>
          <Text style={styles.followUpBody}>{savePrompt.body}</Text>
          {followUpPrompt ? (
            <View style={styles.followUpPromptBox}>
              <View style={styles.oneThingHeader}>
                <Text style={styles.followUpPromptLabel}>Optional bonus turn</Text>
                <Badge
                  label={includedFollowUp ? `+${FOLLOW_UP_BONUS_XP} XP ready` : followUpPrompt.focusLabel}
                  tone={includedFollowUp ? 'success' : 'secondary'}
                />
              </View>
              <Text style={styles.followUpPromptText}>{followUpPrompt.prompt}</Text>
              <Text style={styles.followUpPromptNote}>{followUpPrompt.coachingNote}</Text>
              {!isFollowUpOpen ? (
                <View style={styles.followUpAction}>
                  <AppButton
                    label="Answer follow-up"
                    onPress={() => setIsFollowUpOpen(true)}
                    variant="secondary"
                  />
                </View>
              ) : (
                <>
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
                </>
              )}
            </View>
          ) : null}
          <View style={styles.feedbackActions}>
            <View style={styles.feedbackActionItem}>
              <AppButton label={savePrompt.ctaLabel} onPress={saveSession} />
            </View>
          </View>
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
  feedbackActions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  feedbackActionItem: {
    flex: 1,
  },
  followUpAction: {
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
});
