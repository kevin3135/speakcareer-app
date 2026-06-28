import type { PracticeSession, RoleplayId } from '../types';

export type RoleplayStarterReminder = {
  body: string;
  ctaLabel: string;
  eyebrow: string;
  starterAnswer: string;
};

type CreateRoleplayStarterReminderInput = {
  roleplayId: RoleplayId;
  sessions: Pick<PracticeSession, 'roleplayId'>[];
  starterAnswer: string;
};

export function createRoleplayStarterReminder({
  roleplayId,
  sessions,
  starterAnswer,
}: CreateRoleplayStarterReminderInput): RoleplayStarterReminder | null {
  const hasSavedInterview = sessions.some((session) => session.roleplayId === 'job-interview');

  if (roleplayId !== 'job-interview' || hasSavedInterview) {
    return null;
  }

  return {
    body: 'Use this only if you want a faster first answer.',
    ctaLabel: 'Use starter',
    eyebrow: 'Starter reminder',
    starterAnswer,
  };
}
