import type { PracticeSession } from '../types';

type HomeHeroFocusLabelsInput = {
  detailLabels: string[];
  rewardLabel: string;
  sessions: Pick<PracticeSession, 'id'>[];
};

export function createHomeHeroFocusLabels({
  detailLabels,
  rewardLabel,
  sessions,
}: HomeHeroFocusLabelsInput): string[] {
  if (sessions.length === 0) {
    return detailLabels;
  }

  return ['English', '5 minutes', rewardLabel];
}
