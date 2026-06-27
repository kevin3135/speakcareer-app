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

const FIRST_QUEST_SHORT_REWRITE =
  'I helped my team finish a project on time by organizing tasks and sharing clear updates.';

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
    body: 'Short, clear and professional. Save it to unlock the app.',
    rewrite: FIRST_QUEST_SHORT_REWRITE,
    rewriteLabel: 'Better English',
    title: 'Good. Say it like this.',
    xpLabel: `+${feedbackResult.xpReward} XP`,
  };
}
