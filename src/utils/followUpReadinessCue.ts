import type { FollowUpFocus } from './followUpPrompt';
import type { AnswerReview } from './answerReview';

export type FollowUpReadinessCue = {
  badgeLabel: string;
  body: string;
  chipLine: string;
  title: string;
  tone: 'accent' | 'info' | 'success';
};

type CreateFollowUpReadinessCueInput = {
  focus: FollowUpFocus;
  progressTitle: string;
  review: Pick<AnswerReview, 'wordCount'>;
  stepLabel?: string;
};

const STRONG_ANSWER_WORD_TARGET = 35;

export function createFollowUpReadinessCue({
  focus,
  progressTitle,
  review,
  stepLabel,
}: CreateFollowUpReadinessCueInput): FollowUpReadinessCue {
  const focusBlurb = createFocusBlurb(focus);
  const lowerStepLabel = stepLabel?.trim().toLowerCase();

  if (progressTitle === 'Daily target already complete') {
    return {
      badgeLabel: 'Worth doing',
      body: `Today's target is already done. Use the bonus turn if you want to ${focusBlurb} before you bank this lesson.`,
      chipLine: `Good time to ${focusBlurb}.`,
      title: 'Good time for a deeper rep',
      tone: 'success',
    };
  }

  if (review.wordCount < STRONG_ANSWER_WORD_TARGET) {
    return {
      badgeLabel: 'Save first',
      body: `The main win is this save. Open the bonus turn only if you have 30 more seconds to ${focusBlurb}.`,
      chipLine: `Save first unless you want to ${focusBlurb}.`,
      title: 'Save stays the main win',
      tone: 'info',
    };
  }

  if (focus === 'next-step') {
    return {
      badgeLabel: 'Worth doing',
      body: lowerStepLabel
        ? `Your main answer is already strong. This bonus turn adds one realistic ${lowerStepLabel} before you save.`
        : 'Your main answer is already strong. This bonus turn adds one realistic second question before you save.',
      chipLine: lowerStepLabel
        ? `Adds one realistic ${lowerStepLabel}.`
        : 'Adds one realistic second turn.',
      title: 'This adds a real follow-up rep',
      tone: 'success',
    };
  }

  return {
    badgeLabel: 'Optional polish',
    body: `Take the bonus turn if you want to ${focusBlurb} before you bank the lesson. Otherwise save now and keep today moving.`,
    chipLine: `Use it to ${focusBlurb}.`,
    title: 'Use it to sharpen one weak spot',
    tone: 'accent',
  };
}

function createFocusBlurb(focus: FollowUpFocus) {
  switch (focus) {
    case 'detail':
      return 'add one concrete work detail';
    case 'result':
      return 'add a clearer business result';
    case 'structure':
      return 'tighten the answer structure';
    case 'confidence':
      return 'sound more confident';
    case 'next-step':
      return 'handle one realistic follow-up question';
  }
}
