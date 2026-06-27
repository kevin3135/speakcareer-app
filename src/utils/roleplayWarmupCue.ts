import type { MistakeItem, RoleplayWarmupCue } from '../types';

export function createRoleplayWarmupCue(mistake: MistakeItem): RoleplayWarmupCue {
  return {
    mistakeId: mistake.id,
    eyebrow: 'Warm-up cue',
    badgeLabel: 'From Progress',
    correction: mistake.correction,
    note: mistake.note,
  };
}
