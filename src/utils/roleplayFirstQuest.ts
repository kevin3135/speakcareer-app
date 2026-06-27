import type { PracticeSession, RoleplayId } from '../types';

export type RoleplayFirstQuestDefinition = {
  detailLabels: string[];
  roleplayId: RoleplayId;
  title: string;
};

export type RoleplayFirstQuestState = {
  body: string;
  detailLabels: string[];
  eyebrow: string;
  progressLabel: string;
  title: string;
  unlockLabel: string;
};

type CreateRoleplayFirstQuestStateInput = {
  guidedStart: RoleplayFirstQuestDefinition;
  roleplayId: RoleplayId;
  sessions: PracticeSession[];
};

export function createRoleplayFirstQuestState({
  guidedStart,
  roleplayId,
  sessions,
}: CreateRoleplayFirstQuestStateInput): RoleplayFirstQuestState | null {
  if (roleplayId !== guidedStart.roleplayId || sessions.length > 0) {
    return null;
  }

  return {
    body: 'Start here. Save one short Job Interview answer first so the full practice loop can track your next step.',
    detailLabels: guidedStart.detailLabels,
    eyebrow: 'First quest',
    progressLabel: '0/1 saved',
    title: guidedStart.title,
    unlockLabel: 'Unlock Home and Progress',
  };
}
