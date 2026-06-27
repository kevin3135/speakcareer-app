import type { AnswerReview } from './answerReview';
import type { AIFeedback, PracticeSession, RoleplayScenario } from '../types';

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

  return {
    id: `${roleplay.id}-${completedAt.getTime()}`,
    roleplayId: roleplay.id,
    roleplayTitle: roleplay.title,
    completedAt: completedAt.toISOString(),
    answerPreview: preview,
    wordCount: review.wordCount,
    readinessLabel: review.readinessLabel,
    feedbackSummary: includedFollowUp ? `${feedback.summary} Follow-up included.` : feedback.summary,
    includedFollowUp,
    xpReward,
  };
}

export function formatSessionDate(completedAt: string) {
  return new Date(completedAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}
