import type { AnswerReview } from './answerReview';
import type { AIFeedback, PracticeSession, RoleplayScenario } from '../types';

type CreatePracticeSessionInput = {
  roleplay: RoleplayScenario;
  answer: string;
  review: AnswerReview;
  feedback: AIFeedback;
  xpReward: number;
  completedAt?: Date;
};

export function createPracticeSession({
  roleplay,
  answer,
  review,
  feedback,
  xpReward,
  completedAt = new Date(),
}: CreatePracticeSessionInput): PracticeSession {
  const trimmedAnswer = answer.trim().replace(/\s+/g, ' ');
  const preview = trimmedAnswer.length > 120
    ? `${trimmedAnswer.slice(0, 117)}...`
    : trimmedAnswer;

  return {
    id: `${roleplay.id}-${completedAt.getTime()}`,
    roleplayId: roleplay.id,
    roleplayTitle: roleplay.title,
    completedAt: completedAt.toISOString(),
    answerPreview: preview,
    wordCount: review.wordCount,
    readinessLabel: review.readinessLabel,
    feedbackSummary: feedback.summary,
    xpReward,
  };
}

export function formatSessionDate(completedAt: string) {
  return new Date(completedAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}
