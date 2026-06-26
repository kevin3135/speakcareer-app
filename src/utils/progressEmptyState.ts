import type { RoleplayId } from '../types';

export type ProgressEmptyState = {
  title: string;
  body: string;
  steps: string[];
  ctaLabel: string;
  roleplayId: RoleplayId;
};

export function createProgressEmptyState(): ProgressEmptyState {
  return {
    title: 'Start your first saved session',
    body: 'Complete one short roleplay, review your answer and save it here to begin tracking your career English progress.',
    steps: ['Choose a scenario', 'Write a spoken-style answer', 'Review and save for XP'],
    ctaLabel: 'Start Job Interview',
    roleplayId: 'job-interview',
  };
}
