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
import { FOCUS_SESSION_SECONDS, formatFocusTime } from '../utils/focusTimer';
import { createRuleBasedFeedback, type RuleBasedFeedbackResult } from '../utils/ruleBasedFeedback';
import { createPracticeSession } from '../utils/sessionHistory';

type RoleplayScreenProps = {
  roleplay: RoleplayScenario;
  onSelectRoleplay: (roleplayId: RoleplayId) => void;
  onSaveSession: (session: PracticeSession) => void;
};

export function RoleplayScreen({ onSaveSession, roleplay, onSelectRoleplay }: RoleplayScreenProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [answerReview, setAnswerReview] = useState<AnswerReview | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<RuleBasedFeedbackResult | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(FOCUS_SESSION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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
    const nextFeedbackResult = createRuleBasedFeedback(roleplay, draftAnswer, review);

    setAnswerReview(review);
    setFeedbackResult(nextFeedbackResult);
    setShowFeedback(review.isReadyForFeedback);
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

  function clearAnswer() {
    setDraftAnswer('');
    setAnswerReview(null);
    setFeedbackResult(null);
    setShowFeedback(false);
    setSavedSessionId(null);
    resetFocusTimer();
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
      xpReward: feedbackResult.xpReward,
    });

    setSavedSessionId(session.id);
    setIsTimerRunning(false);
    onSaveSession(session);
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
              accessibilityRole="button"
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
          <Text style={styles.detailText}>{roleplay.userGoal}</Text>
        </View>
      </Card>

      <Card muted>
        <Text style={styles.detailLabel}>{roleplay.aiPersona} opens with</Text>
        <Text style={styles.openingLine}>{roleplay.openingLine}</Text>
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
            accessibilityRole="button"
            onPress={toggleFocusTimer}
            style={({ pressed }) => [styles.timerButton, pressed && styles.timerButtonPressed]}
          >
            <Text style={styles.timerButtonText}>
              {isTimerRunning ? 'Pause' : timerSeconds === 0 ? 'Restart' : 'Start'}
            </Text>
          </Pressable>
          <Pressable
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
          {roleplay.suggestedPhrases.map((phrase) => (
            <Text key={phrase} style={styles.phrase}>- {phrase}</Text>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.detailLabel}>Your answer</Text>
        <TextInput
          accessibilityLabel="Practice answer"
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
          label="Review answer"
          onPress={reviewAnswer}
        />
        {answerReview?.isReadyForFeedback && !savedSessionId ? (
          <View style={styles.secondaryAction}>
            <AppButton label="Save session" onPress={saveSession} variant="quiet" />
          </View>
        ) : null}
        <AppButton label="Clear" onPress={clearAnswer} variant="secondary" />
      </View>
      {savedSessionId ? (
        <Text style={styles.savedNote}>
          Session saved to Progress. +{feedbackResult?.xpReward ?? 0} XP.
        </Text>
      ) : null}

      {showFeedback && feedbackResult ? <FeedbackPanel feedback={feedbackResult.feedback} /> : null}
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
  secondaryAction: {
    marginTop: spacing.md,
  },
  savedNote: {
    color: colors.success,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
