import type { DailyPracticeTarget } from '../types';
import type { LevelProgress } from './levelProgress';

export type ProgressLevelRunway = {
  badgeLabel: string;
  body: string;
  progressLabel: string;
  progressPercent: number;
  targetLabel: string;
  title: string;
  totalXpLabel: string;
};

type CreateProgressLevelRunwayInput = {
  dailyTarget: DailyPracticeTarget;
  levelProgress: LevelProgress;
  targetSessionsCompleted: number;
  targetSessionsRemaining: number;
};

export function createProgressLevelRunway({
  dailyTarget,
  levelProgress,
  targetSessionsCompleted,
  targetSessionsRemaining,
}: CreateProgressLevelRunwayInput): ProgressLevelRunway {
  return {
    badgeLabel: levelProgress.currentLevelLabel,
    body: createRunwayBody(targetSessionsCompleted, targetSessionsRemaining),
    progressLabel: levelProgress.progressLabel,
    progressPercent: levelProgress.progressPercent,
    targetLabel: `${Math.min(targetSessionsCompleted, dailyTarget)}/${dailyTarget} today`,
    title: levelProgress.nextLevelLabel,
    totalXpLabel: levelProgress.totalXpLabel,
  };
}

function createRunwayBody(targetSessionsCompleted: number, targetSessionsRemaining: number) {
  if (targetSessionsCompleted === 0) {
    return 'Save one short answer today to move this level bar and keep the streak active.';
  }

  if (targetSessionsRemaining === 0) {
    return 'Today\'s target is complete. One extra saved answer keeps this level moving.';
  }

  if (targetSessionsRemaining === 1) {
    return 'One more saved answer today completes the target and keeps you moving toward the next level.';
  }

  return `${targetSessionsRemaining} more saved answers today close the target and keep this level moving.`;
}
