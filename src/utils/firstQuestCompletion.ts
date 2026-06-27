import type { NextPracticeRecommendation } from './practiceCompletion';

export type FirstQuestCompletionState = {
  body: string;
  ctaLabel: string;
  ctaTarget: 'progress' | 'roleplay';
  eyebrow: string;
  nextTitle: string;
  title: string;
  unlockLabel: string;
  xpLabel: string;
};

type CreateFirstQuestCompletionStateInput = {
  nextPracticeRecommendation: Pick<NextPracticeRecommendation, 'reason' | 'title'> | null;
  xpReward: number;
};

export function createFirstQuestCompletionState({
  nextPracticeRecommendation,
  xpReward,
}: CreateFirstQuestCompletionStateInput): FirstQuestCompletionState {
  const safeXpReward = Math.max(0, xpReward);

  if (!nextPracticeRecommendation) {
    return {
      body: 'Good. Your answer is saved and your progress is ready.',
      ctaLabel: 'Continue',
      ctaTarget: 'progress',
      eyebrow: 'Step 3 of 3',
      nextTitle: 'Wins',
      title: 'Saved',
      unlockLabel: 'Progress unlocked',
      xpLabel: `+${safeXpReward} XP`,
    };
  }

  return {
    body: 'Good. Your answer is saved. The app picked your next lesson.',
    ctaLabel: 'Continue',
    ctaTarget: 'roleplay',
    eyebrow: 'Step 3 of 3',
    nextTitle: nextPracticeRecommendation.title,
    title: 'Saved',
    unlockLabel: 'Next lesson unlocked',
    xpLabel: `+${safeXpReward} XP`,
  };
}
