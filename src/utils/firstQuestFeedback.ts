import type { AnswerReview } from './answerReview';
import type { RuleBasedFeedbackResult } from './ruleBasedFeedback';

export type FirstQuestFeedbackState = {
  body: string;
  rewrite?: string;
  rewriteLabel?: string;
  title: string;
  xpLabel?: string;
};

type CreateFirstQuestFeedbackStateInput = {
  answerReview: AnswerReview | null;
  feedbackResult: RuleBasedFeedbackResult | null;
};

export function createFirstQuestFeedbackState({
  answerReview,
  feedbackResult,
}: CreateFirstQuestFeedbackStateInput): FirstQuestFeedbackState | null {
  if (!answerReview) {
    return null;
  }

  if (!answerReview.isReadyForFeedback || !feedbackResult) {
    return {
      body: answerReview.reviewNote,
      title: answerReview.readinessLabel,
    };
  }

  return {
    body: 'This version is clearer. Save it to unlock the app.',
    rewrite: feedbackResult.feedback.suggestedRewrite,
    rewriteLabel: 'Better English',
    title: 'Good. Say it like this.',
    xpLabel: `+${feedbackResult.xpReward} XP`,
  };
}
