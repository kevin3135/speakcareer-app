import type { RoleplayId } from '../types';

export type ProgressEmptyState = {
  body: string;
  ctaLabel: string;
  eyebrow: string;
  progressLabel: string;
  rewardLabel: string;
  roleplayId: RoleplayId;
  steps: string[];
  title: string;
};

export function createProgressEmptyState(): ProgressEmptyState {
  return {
    body: 'Progress unlocks after one saved answer. Do a short Job Interview quest, review the feedback and save it here.',
    ctaLabel: 'Start first save quest',
    eyebrow: 'First save quest',
    progressLabel: '0/1 saved',
    rewardLabel: '+40 XP',
    roleplayId: 'job-interview',
    steps: ['Start Job Interview', 'Review your rewrite', 'Save to unlock history'],
    title: 'Unlock Progress',
  };
}
