import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario, StartingLevelId } from '../types';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createNextPracticeRecommendation, createSavedRoleplayHandoff } from '../utils/practiceCompletion';
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
};

export function RoleplayScreen({
  onBack,
  onOpenProgress,
  onSaveSession,
  roleplay,
  onSelectRoleplay,
  startingLevelId,
}: RoleplayScreenProps) {
  const answerInputRef = useRef<TextInput>(null);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [answerReview, setAnswerReview] = useState<AnswerReview | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<RuleBasedFeedbackResult | null>(null);
  const [savedSession, setSavedSession] = useState<PracticeSession | null>(null);
  const [isAnswerFocused, setIsAnswerFocused] = useState(false);

  const activeVariant = roleplay.promptVariants?.[0];
  const openingLine = activeVariant?.openingLine ?? roleplay.openingLine;
  const xpReward = feedbackResult?.xpReward ?? roleplay.durationMinutes * 4;
  const nextRecommendation = createNextPracticeRecommendation(roleplay.id, practiceContent.roleplays);
  const savedHandoff = createSavedRoleplayHandoff({
    nextPracticeRecommendation: nextRecommendation,
    xpReward,
  });
  const levelProfile = getStartingLevelProfile(startingLevelId);
  const isReviewStep = Boolean(feedbackResult);

  function reviewAnswer() {
    const review = summarizePracticeAnswer(draftAnswer);
    const nextFeedback = createRuleBasedFeedback(roleplay, draftAnswer, review, activeVariant);

    setAnswerReview(review);
    setFeedbackResult(nextFeedback);
    setSavedSession(null);
  }

  function retryAnswer() {
    setFeedbackResult(null);
    setAnswerReview(null);
    setSavedSession(null);
    answerInputRef.current?.focus();
  }

  function saveSession() {
    if (!answerReview?.isReadyForFeedback || !feedbackResult) {
      return;
    }

    const session = createPracticeSession({
      answer: draftAnswer,
      feedback: feedbackResult.feedback,
      review: answerReview,
      roleplay,
      xpReward,
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
          subtitle={savedHandoff.body}
          title={savedHandoff.title}
          tone="success"
        >
          <View style={styles.completeBadges}>
            <XPBadge label={savedHandoff.xpLabel} />
            <Badge label="Streak updated" tone="accent" />
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
            style={[styles.answerInput, isAnswerFocused && styles.answerInputActive]}
            textAlignVertical="top"
            value={draftAnswer}
          />
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
            <XPBadge label={`+${feedbackResult.xpReward} XP`} />
          </View>
          <Text style={styles.cardTitle}>{answerReview?.readinessLabel ?? 'Good start'}</Text>
          <View style={styles.betterEnglishBox}>
            <Text style={styles.betterEnglishLabel}>Better English</Text>
            <Text style={styles.betterEnglishText}>{feedbackResult.feedback.suggestedRewrite}</Text>
          </View>
          <View style={styles.feedbackActions}>
            <View style={styles.feedbackActionItem}>
              <AppButton
                disabled={!answerReview?.isReadyForFeedback}
                label={answerReview?.isReadyForFeedback ? 'Save answer' : 'Add more first'}
                onPress={saveSession}
              />
            </View>
            <View style={styles.feedbackActionItem}>
              <AppButton label="Try again" onPress={retryAnswer} variant="secondary" />
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
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.lg,
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
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.lg,
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
    marginTop: spacing.md,
    minHeight: 150,
    padding: spacing.lg,
  },
  answerInputActive: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  answerAction: {
    marginTop: spacing.lg,
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
