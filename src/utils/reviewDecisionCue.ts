import type { RuleBasedFeedbackResult } from './ruleBasedFeedback';
import type { AnswerReview } from './answerReview';

export type ReviewDecisionCue = {
  badgeLabel: string;
  body: string;
  title: string;
  tone: 'info' | 'accent' | 'success';
};

type CreateReviewDecisionCueInput = {
  feedbackResult: RuleBasedFeedbackResult;
  review: AnswerReview;
};

const STRONG_ANSWER_WORD_TARGET = 35;

export function createReviewDecisionCue({
  feedbackResult,
  review,
}: CreateReviewDecisionCueInput): ReviewDecisionCue {
  const firstImprovement = feedbackResult.feedback.improvements.find((item) => item.trim().length > 0)?.trim();

  if (!review.isReadyForFeedback) {
    return {
      badgeLabel: 'Retry first',
      body: `${firstImprovement ?? review.reviewNote} Then check again before saving.`,
      title: 'Add one more sentence first',
      tone: 'info',
    };
  }

  if (review.wordCount < STRONG_ANSWER_WORD_TARGET) {
    return {
      badgeLabel: 'Save or retry once',
      body: `${firstImprovement ?? review.reviewNote} If you can add that now, retry once. Otherwise bank this rep and keep today moving.`,
      title: 'Good enough to save',
      tone: 'accent',
    };
  }

  return {
    badgeLabel: 'Bank this rep',
    body: 'This answer is strong enough for today. Save it now, or retry only if you want one cleaner version before you bank the lesson.',
    title: 'Ready to save',
    tone: 'success',
  };
}
