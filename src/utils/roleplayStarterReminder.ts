import type { PracticeSession, RoleplayId } from '../types';

export type RoleplayStarterReminder = {
  body: string;
  ctaLabel: string;
  editPlanLabel: string;
  editPlanSteps: [string, string, string];
  eyebrow: string;
  pathLabel: string;
  starterAnswer: string;
};

type CreateRoleplayStarterReminderInput = {
  levelLabel: string;
  roleplayId: RoleplayId;
  sessions: Pick<PracticeSession, 'roleplayId'>[];
  starterAnswer: string;
  starterEditSteps: [string, string, string];
};

export function createRoleplayStarterReminder({
  levelLabel,
  roleplayId,
  sessions,
  starterAnswer,
  starterEditSteps,
}: CreateRoleplayStarterReminderInput): RoleplayStarterReminder | null {
  const hasSavedInterview = sessions.some((session) => session.roleplayId === 'job-interview');

  if (roleplayId !== 'job-interview' || hasSavedInterview) {
    return null;
  }

  return {
    body: 'Use this only if you want a faster first answer.',
    ctaLabel: 'Use starter',
    editPlanLabel: 'Make it yours',
    editPlanSteps: starterEditSteps,
    eyebrow: 'Starter reminder',
    pathLabel: `From your ${levelLabel} path`,
    starterAnswer,
  };
}
