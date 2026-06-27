import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  FeedbackCard,
  GradientHero,
  LessonCard,
  ProgressBar,
  ScreenContainer,
  XPBadge,
} from '../components/ui';
import { practiceContent } from '../data/content';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario, StartingLevelId } from '../types';
import { summarizePracticeAnswer, type AnswerReview } from '../utils/answerReview';
import { createNextPracticeRecommendation } from '../utils/practiceCompletion';
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
  const isReady = Boolean(answerReview?.isReadyForFeedback && feedbackResult);
  const levelProfile = getStartingLevelProfile(startingLevelId);

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
      <ScreenContainer
        overline="Lesson complete"
        subtitle="Your answer is saved. Keep the rhythm going."
        title="Nice work"
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

        <GradientHero
          overline="Career win"
          subtitle="Your correction is saved to Wins and your next roleplay is ready."
          title="Practice saved"
          tone="success"
        >
          <View style={styles.completeBadges}>
            <XPBadge label={`+${savedSession.xpReward} XP`} />
            <Badge label="Streak updated" tone="accent" />
          </View>
        </GradientHero>

        <Card tone="strong">
          <Text style={styles.cardKicker}>Progress to next level</Text>
          <Text style={styles.cardTitle}>Level momentum</Text>
          <View style={styles.progressWrap}>
            <ProgressBar value={68} tone="accent" />
          </View>
        </Card>

        {nextRecommendation ? (
          <LessonCard
            body={nextRecommendation.reason}
            ctaLabel="Continue"
            index={2}
            meta="Next recommended lesson"
            onPress={continueToNext}
            state="current"
            title={nextRecommendation.title}
            xpLabel="+45 XP"
          />
        ) : null}

        <AppButton label="Continue" onPress={continueToNext} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      overline="AI roleplay"
      right={<XPBadge label={`+${roleplay.durationMinutes * 4} XP`} />}
      subtitle="Speak or type one answer. The coach gives a better professional version."
      title={roleplay.title}
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

      <Card tone="strong">
        <View style={styles.oneThingHeader}>
          <Text style={styles.cardKicker}>Your turn</Text>
          <Badge label={`${roleplay.durationMinutes} min`} tone="info" />
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
            label={isReady ? 'Check again' : 'Check answer'}
            onPress={reviewAnswer}
          />
        </View>
      </Card>

      {feedbackResult ? (
        <FeedbackCard
          correctedVersion={feedbackResult.feedback.suggestedRewrite}
          explanation="The stronger version adds structure, a concrete action and a clear result. That makes the answer easier to trust in a professional conversation."
          onRetry={retryAnswer}
          onSaveMistake={saveSession}
          scores={[
            { label: 'Grammar', value: feedbackResult.feedback.scores[0]?.value ?? 78 },
            { label: 'Fluency', value: feedbackResult.feedback.scores[1]?.value ?? 76 },
            { label: 'Professional tone', value: feedbackResult.feedback.scores[2]?.value ?? 82 },
            { label: 'Confidence', value: feedbackResult.feedback.scores[3]?.value ?? 74 },
          ]}
          strongerVersion={feedbackResult.feedback.suggestedRewrite}
          summary={feedbackResult.feedback.summary}
          toImprove={feedbackResult.feedback.improvements}
          wentWell={feedbackResult.feedback.strengths}
        />
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
  completeBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  progressWrap: {
    marginTop: spacing.lg,
  },
});
