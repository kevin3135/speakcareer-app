import type { MistakeItem, RoleplayWarmupCue } from '../types';

export function createRoleplayWarmupCue(mistake: MistakeItem): RoleplayWarmupCue {
  return {
    mistakeId: mistake.id,
    eyebrow: 'Warm-up cue',
    badgeLabel: 'From Progress',
    ctaLabel: 'Use this line',
    correction: mistake.correction,
    note: mistake.note,
    starterAnswer: mistake.correction,
  };
}
