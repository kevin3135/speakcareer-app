import type { RoleplayWarmupCue } from '../types';
import type { RoleplayStarterReminder } from './roleplayStarterReminder';

type CreateRoleplayAnswerStarterStateInput = {
  hasDraftAnswer: boolean;
  quickStartPhrase?: string;
  starterReminder?: RoleplayStarterReminder | null;
  warmupCue?: RoleplayWarmupCue | null;
};

export type RoleplayAnswerStarterState = {
  badgeLabel: string;
  body: string;
  ctaLabel: string;
  eyebrow: string;
  note: string;
  source: 'quick-start' | 'starter-reminder' | 'warmup';
  tone: 'accent' | 'info' | 'secondary';
};

export function createRoleplayAnswerStarterState({
  hasDraftAnswer,
  quickStartPhrase,
  starterReminder,
  warmupCue,
}: CreateRoleplayAnswerStarterStateInput): RoleplayAnswerStarterState | null {
  if (hasDraftAnswer) {
    return null;
  }

  if (warmupCue && !warmupCue.autoApplyStarter) {
    return {
      badgeLabel: warmupCue.badgeLabel,
      body: warmupCue.correction,
      ctaLabel: warmupCue.ctaLabel,
      eyebrow: warmupCue.eyebrow,
      note: warmupCue.note,
      source: 'warmup',
      tone: 'info',
    };
  }

  if (starterReminder) {
    return {
      badgeLabel: 'First answer',
      body: starterReminder.starterAnswer,
      ctaLabel: starterReminder.ctaLabel,
      eyebrow: starterReminder.eyebrow,
      note: starterReminder.body,
      source: 'starter-reminder',
      tone: 'secondary',
    };
  }

  const trimmedQuickStartPhrase = quickStartPhrase?.trim();

  if (!trimmedQuickStartPhrase) {
    return null;
  }

  return {
    badgeLabel: 'Quick line',
    body: trimmedQuickStartPhrase,
    ctaLabel: 'Use starter',
    eyebrow: 'Quick starter',
    note: 'Use one short first line, then make the rest your own.',
    source: 'quick-start',
    tone: 'accent',
  };
}
