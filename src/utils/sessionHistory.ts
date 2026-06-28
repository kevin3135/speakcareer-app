import type { AnswerReview } from './answerReview';
import type { AIFeedback, PracticeSession, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createFeedbackScoreSummary } from './feedbackScoreSummary.ts';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createFeedbackSnapshot } from './feedbackSnapshot.ts';

type CreatePracticeSessionInput = {
  roleplay: RoleplayScenario;
  answer: string;
  followUpAnswer?: string;
  includedFollowUp?: boolean;
  review: AnswerReview;
  feedback: AIFeedback;
  xpReward: number;
  completedAt?: Date;
};

export function createPracticeSession({
  roleplay,
  answer,
  followUpAnswer,
  includedFollowUp = false,
  review,
  feedback,
  xpReward,
  completedAt = new Date(),
}: CreatePracticeSessionInput): PracticeSession {
  const trimmedAnswer = answer.trim().replace(/\s+/g, ' ');
  const trimmedFollowUpAnswer = followUpAnswer?.trim().replace(/\s+/g, ' ') ?? '';
  const sessionAnswer = includedFollowUp && trimmedFollowUpAnswer
    ? `${trimmedAnswer} Follow-up: ${trimmedFollowUpAnswer}`
    : trimmedAnswer;
  const preview = sessionAnswer.length > 120
    ? `${sessionAnswer.slice(0, 117)}...`
    : sessionAnswer;
  const coachingFocus = createSessionCoachingFocus(answer, feedback);

  return {
    id: `${roleplay.id}-${completedAt.getTime()}`,
    roleplayId: roleplay.id,
    roleplayTitle: roleplay.title,
    completedAt: completedAt.toISOString(),
    answerPreview: preview,
    wordCount: review.wordCount,
    readinessLabel: review.readinessLabel,
    feedbackSummary: includedFollowUp ? `${feedback.summary} Follow-up included.` : feedback.summary,
    nextFocusLabel: coachingFocus.label,
    nextFocusText: coachingFocus.text,
    includedFollowUp,
    xpReward,
  };
}

function createSessionCoachingFocus(answer: string, feedback: AIFeedback) {
  const snapshot = createFeedbackSnapshot({
    answer,
    improvements: feedback.improvements,
    summary: createFeedbackScoreSummary(feedback.scores),
  });
  const fallbackText = feedback.improvements.find((item) => item.trim().length > 0) ?? feedback.summary;

  if (!snapshot) {
    return {
      label: 'Coach target',
      text: fallbackText,
    };
  }

  return {
    label: snapshot.nextFocusLabel,
    text: snapshot.nextMoveText,
  };
}

export function formatSessionDate(completedAt: string) {
  return new Date(completedAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}
