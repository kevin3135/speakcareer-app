import type { AnswerReview } from './answerReview';
import type { RuleBasedFeedbackResult } from './ruleBasedFeedback';

export type FirstQuestFeedbackState = {
  body: string;
  nextUnlock?: {
    body: string;
    eyebrow: string;
    progressLabel: string;
    title: string;
  };
  rewrite?: string;
  rewriteLabel?: string;
  title: string;
  xpLabel?: string;
};

type CreateFirstQuestFeedbackStateInput = {
  answerReview: AnswerReview | null;
  feedbackResult: RuleBasedFeedbackResult | null;
  progressLabel?: string;
  unlockLabel?: string;
};

const FIRST_QUEST_SHORT_REWRITE =
  'I helped my team finish a project on time by organizing tasks and sharing clear updates.';

export function createFirstQuestFeedbackState({
  answerReview,
  feedbackResult,
  progressLabel,
  unlockLabel,
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
    nextUnlock: createNextUnlockCue({ progressLabel, unlockLabel }),
    rewrite: FIRST_QUEST_SHORT_REWRITE,
    rewriteLabel: 'Better English',
    title: 'Good. Say it like this.',
    xpLabel: `+${feedbackResult.xpReward} XP`,
  };
}

function createNextUnlockCue({
  progressLabel,
  unlockLabel,
}: Pick<CreateFirstQuestFeedbackStateInput, 'progressLabel' | 'unlockLabel'>) {
  if (!progressLabel || !unlockLabel) {
    return undefined;
  }

  const unlockTarget = unlockLabel.replace(/^Unlock\s+/i, 'unlock ');

  return {
    body: `Next step is Save. This first win will ${unlockTarget}.`,
    eyebrow: 'Next unlock',
    progressLabel,
    title: unlockLabel,
  };
}
