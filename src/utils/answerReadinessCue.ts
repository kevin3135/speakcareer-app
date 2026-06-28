import type { AnswerReview } from './answerReview';

export type AnswerReadinessCue = {
  badgeLabel: string;
  note: string;
  progressLabel: string;
  progressPercent: number;
  title: string;
  tone: 'secondary' | 'accent' | 'success';
};

const STRONG_ANSWER_WORD_TARGET = 35;
const FEEDBACK_UNLOCK_WORD_TARGET = 12;

export function createAnswerReadinessCue(review: AnswerReview): AnswerReadinessCue {
  const badgeLabel = `${review.wordCount} ${review.wordCount === 1 ? 'word' : 'words'}`;
  const progressPercent = Math.round(
    (Math.min(review.wordCount, STRONG_ANSWER_WORD_TARGET) / STRONG_ANSWER_WORD_TARGET) * 100,
  );

  if (review.wordCount === 0) {
    return {
      badgeLabel,
      note: 'Aim for 2-4 short sentences from a real work situation.',
      progressLabel: `0/${FEEDBACK_UNLOCK_WORD_TARGET} words to unlock feedback`,
      progressPercent,
      title: 'Write your first answer',
      tone: 'secondary',
    };
  }

  if (!review.isReadyForFeedback) {
    return {
      badgeLabel,
      note: review.reviewNote,
      progressLabel: `${review.wordCount}/${FEEDBACK_UNLOCK_WORD_TARGET} words to unlock feedback`,
      progressPercent,
      title: review.readinessLabel,
      tone: 'secondary',
    };
  }

  if (review.wordCount < STRONG_ANSWER_WORD_TARGET) {
    return {
      badgeLabel,
      note: review.reviewNote,
      progressLabel: `${review.wordCount}/${STRONG_ANSWER_WORD_TARGET} words for a stronger answer`,
      progressPercent,
      title: review.readinessLabel,
      tone: 'accent',
    };
  }

  return {
    badgeLabel,
    note: review.reviewNote,
    progressLabel: 'Strong short answer',
    progressPercent,
    title: review.readinessLabel,
    tone: 'success',
  };
}
