import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';

type PracticeCareerPathRoleplay = Pick<
  RoleplayScenario,
  'category' | 'durationMinutes' | 'id' | 'targetLevel' | 'title'
>;

type PracticeCareerPathStepState = 'done' | 'active' | 'locked';

export type PracticeCareerPathStep = {
  caption: string;
  id: string;
  roleplayId: RoleplayId;
  state: PracticeCareerPathStepState;
  title: string;
  xpLabel: string;
};

export type PracticeCareerPath = {
  body: string;
  ctaLabel: string;
  meta: string;
  progressLabel: string;
  progressPercent: number;
  roleplayId: RoleplayId;
  steps: PracticeCareerPathStep[];
  title: string;
};

type PracticeCareerPathInput = {
  roleplays: PracticeCareerPathRoleplay[];
  sessions: Pick<PracticeSession, 'roleplayId'>[];
};

export function createPracticeCareerPath({
  roleplays,
  sessions,
}: PracticeCareerPathInput): PracticeCareerPath {
  const fallbackRoleplayId = roleplays[0]?.id ?? 'job-interview';

  if (roleplays.length === 0) {
    return {
      body: 'Start with one short English roleplay to begin your practice loop.',
      ctaLabel: 'Start first quest',
      meta: 'Start simple',
      progressLabel: '0 of 0 complete',
      progressPercent: 0,
      roleplayId: fallbackRoleplayId,
      steps: [],
      title: 'Begin your career path',
    };
  }

  const completedRoleplayIds = new Set(sessions.map((session) => session.roleplayId));
  const completedCount = roleplays.filter((roleplay) => completedRoleplayIds.has(roleplay.id)).length;
  const latestRoleplayId = sessions[0]?.roleplayId;
  const fallbackNextRoleplay = getNextRoleplay(latestRoleplayId, roleplays) ?? roleplays[0];
  const nextRoleplay =
    roleplays.find((roleplay) => !completedRoleplayIds.has(roleplay.id)) ?? fallbackNextRoleplay;
  const progressPercent = Math.round((completedCount / roleplays.length) * 100);
  const isPathComplete = completedCount === roleplays.length;

  return {
    body: isPathComplete
      ? `You have cleared every core English roleplay. Replay ${nextRoleplay.title} to keep the streak professional and sharp.`
      : completedCount === 0
        ? `Start with ${nextRoleplay.title}. Save one short answer to unlock the next workplace conversation.`
        : `Your next unlocked sprint is ${nextRoleplay.title}. Stay in sequence so each practice builds on the last one.`,
    ctaLabel: isPathComplete ? `Replay ${nextRoleplay.title}` : `Start ${nextRoleplay.title}`,
    meta: isPathComplete
      ? 'Full path complete'
      : completedCount === 0
        ? 'Start simple'
        : `${completedCount} of ${roleplays.length} complete`,
    progressLabel: `${completedCount} of ${roleplays.length} complete`,
    progressPercent,
    roleplayId: nextRoleplay.id,
    steps: roleplays.map((roleplay) => ({
      caption: `${roleplay.category} | ${roleplay.targetLevel} | ${roleplay.durationMinutes} min`,
      id: roleplay.id,
      roleplayId: roleplay.id,
      state: getStepState(roleplay.id, completedRoleplayIds, nextRoleplay.id),
      title: roleplay.title,
      xpLabel: `+${roleplay.durationMinutes * 4} XP`,
    })),
    title: isPathComplete ? 'Career path complete' : `Next: ${nextRoleplay.title}`,
  };
}

function getStepState(
  roleplayId: RoleplayId,
  completedRoleplayIds: Set<RoleplayId>,
  nextRoleplayId: RoleplayId,
): PracticeCareerPathStepState {
  if (roleplayId === nextRoleplayId) {
    return 'active';
  }

  if (completedRoleplayIds.has(roleplayId)) {
    return 'done';
  }

  return 'locked';
}

function getNextRoleplay(
  currentRoleplayId: RoleplayId | undefined,
  roleplays: PracticeCareerPathRoleplay[],
) {
  if (roleplays.length === 0) {
    return null;
  }

  if (!currentRoleplayId) {
    return roleplays[0];
  }

  const currentIndex = roleplays.findIndex((roleplay) => roleplay.id === currentRoleplayId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % roleplays.length;

  return roleplays[nextIndex];
}
