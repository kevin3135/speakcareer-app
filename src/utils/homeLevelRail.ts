import type { LevelProgress } from './levelProgress';

export type HomeLevelRail = {
  badgeLabel: string;
  progressLabel: string;
  progressPercent: number;
  remainingLabel: string;
};

const NEXT_LEVEL_PATTERN = /^(\d+)\s+XP\s+to\s+Level\s+\d+$/i;

export function createHomeLevelRail(
  levelProgress: Pick<
    LevelProgress,
    'currentLevelLabel' | 'nextLevelLabel' | 'progressLabel' | 'progressPercent'
  >,
): HomeLevelRail {
  const xpRemaining = levelProgress.nextLevelLabel.match(NEXT_LEVEL_PATTERN)?.[1];

  return {
    badgeLabel: levelProgress.currentLevelLabel,
    progressLabel: levelProgress.progressLabel,
    progressPercent: levelProgress.progressPercent,
    remainingLabel: xpRemaining ? `${xpRemaining} XP left` : levelProgress.nextLevelLabel,
  };
}
