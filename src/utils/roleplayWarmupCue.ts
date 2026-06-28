import type { MistakeItem, RoleplayWarmupCue } from '../types';

export function createRoleplayWarmupCue(mistake: MistakeItem): RoleplayWarmupCue {
  return {
    cueId: mistake.id,
    eyebrow: 'Warm-up cue',
    badgeLabel: 'From Progress',
    ctaLabel: 'Use this line',
    correction: mistake.correction,
    note: mistake.note,
    starterAnswer: mistake.correction,
  };
}

type FoundationWarmupCueInput = {
  coachNote: string;
  starterAnswer: string;
};

export function createFoundationWarmupCue({
  coachNote,
  starterAnswer,
}: FoundationWarmupCueInput): RoleplayWarmupCue {
  return {
    cueId: 'foundation-starter',
    eyebrow: 'Foundation handoff',
    badgeLabel: 'From Lesson 1',
    ctaLabel: 'Use starter line',
    correction: starterAnswer,
    note: coachNote,
    starterAnswer,
  };
}
