import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';

type HomeLearnStepState = 'current' | 'completed' | 'locked';
type RoleplayPathStepState = 'done' | 'active' | 'locked';

type HomeLearnRoleplay = Pick<
  RoleplayScenario,
  'category' | 'durationMinutes' | 'id' | 'targetLevel' | 'title'
>;

export type HomeLearnHero = {
  body: string;
  ctaLabel: string;
  eyebrow: string;
  target: 'foundation' | RoleplayId;
  title: string;
};

export type HomeLearnStep = {
  body: string;
  ctaLabel?: string;
  meta: string;
  roleplayId?: RoleplayId;
  state: HomeLearnStepState;
  title: string;
  xpLabel: string;
};

export type HomeLearnState = {
  hero: HomeLearnHero;
  steps: HomeLearnStep[];
};

type CreateHomeLearnStateInput = {
  foundationCtaLabel: string;
  foundationTitle: string;
  roleplays: HomeLearnRoleplay[];
  sessions: Pick<PracticeSession, 'roleplayId'>[];
};

type RoleplayPath = {
  body: string;
  ctaLabel: string;
  roleplayId: RoleplayId;
  steps: {
    caption: string;
    roleplayId: RoleplayId;
    state: RoleplayPathStepState;
    title: string;
    xpLabel: string;
  }[];
  title: string;
};

export function createHomeLearnState({
  foundationCtaLabel,
  foundationTitle,
  roleplays,
  sessions,
}: CreateHomeLearnStateInput): HomeLearnState {
  const hasSavedPractice = sessions.length > 0;
  const roleplayPath = createRoleplayPath(roleplays, sessions);

  return {
    hero: hasSavedPractice
      ? {
          body: roleplayPath.body,
          ctaLabel: roleplayPath.ctaLabel,
          eyebrow: 'Next quest',
          target: roleplayPath.roleplayId,
          title: roleplayPath.title,
        }
      : {
          body: 'Tap three blocks: I, action, result. Then the interview unlocks.',
          ctaLabel: 'Start step 1',
          eyebrow: 'Step 1',
          target: 'foundation',
          title: foundationTitle,
        },
    steps: [
      {
        body: 'Learn the sentence shape that makes work English clear.',
        ctaLabel: hasSavedPractice ? undefined : foundationCtaLabel,
        meta: '2 min foundation',
        state: hasSavedPractice ? 'completed' : 'current',
        title: 'Clear sentence',
        xpLabel: '+20 XP',
      },
      ...roleplayPath.steps.map((step) => ({
        body: getRoleplayStepBody({
          hasSavedPractice,
          state: step.state,
          title: step.title,
        }),
        ctaLabel: hasSavedPractice && step.state === 'active' ? 'Open now' : undefined,
        meta: step.caption,
        roleplayId: step.roleplayId,
        state: hasSavedPractice ? mapPracticeStepState(step.state) : 'locked',
        title: step.title,
        xpLabel: step.xpLabel,
      })),
    ],
  };
}

function createRoleplayPath(
  roleplays: HomeLearnRoleplay[],
  sessions: Pick<PracticeSession, 'roleplayId'>[],
): RoleplayPath {
  const fallbackRoleplayId: RoleplayId = roleplays[0]?.id ?? 'job-interview';

  if (roleplays.length === 0) {
    return {
      body: 'Start with one short English roleplay to begin your practice loop.',
      ctaLabel: 'Start Job Interview',
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
  const isPathComplete = completedCount === roleplays.length;

  return {
    body: createRoleplayPathBody(completedCount, isPathComplete, nextRoleplay.title),
    ctaLabel: isPathComplete ? `Replay ${nextRoleplay.title}` : `Start ${nextRoleplay.title}`,
    roleplayId: nextRoleplay.id,
    steps: roleplays.map((roleplay) => ({
      caption: `${roleplay.category} | ${roleplay.targetLevel} | ${roleplay.durationMinutes} min`,
      roleplayId: roleplay.id,
      state: getRoleplayStepState(roleplay.id, completedRoleplayIds, nextRoleplay.id),
      title: roleplay.title,
      xpLabel: `+${roleplay.durationMinutes * 4} XP`,
    })),
    title: isPathComplete ? 'Career path complete' : `Next: ${nextRoleplay.title}`,
  };
}

function createRoleplayPathBody(
  completedCount: number,
  isPathComplete: boolean,
  nextRoleplayTitle: string,
) {
  if (isPathComplete) {
    return `You have cleared every core English roleplay. Replay ${nextRoleplayTitle} to keep the streak professional and sharp.`;
  }

  if (completedCount === 0) {
    return `Start with ${nextRoleplayTitle}. Save one short answer to unlock the next workplace conversation.`;
  }

  return `Your next unlocked sprint is ${nextRoleplayTitle}. Stay in sequence so each practice builds on the last one.`;
}

function getNextRoleplay(
  currentRoleplayId: RoleplayId | undefined,
  roleplays: HomeLearnRoleplay[],
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

function getRoleplayStepState(
  roleplayId: RoleplayId,
  completedRoleplayIds: Set<RoleplayId>,
  nextRoleplayId: RoleplayId,
): RoleplayPathStepState {
  if (roleplayId === nextRoleplayId) {
    return 'active';
  }

  if (completedRoleplayIds.has(roleplayId)) {
    return 'done';
  }

  return 'locked';
}

function mapPracticeStepState(state: RoleplayPathStepState): HomeLearnStepState {
  if (state === 'done') {
    return 'completed';
  }

  if (state === 'active') {
    return 'current';
  }

  return 'locked';
}

function getRoleplayStepBody({
  hasSavedPractice,
  state,
  title,
}: {
  hasSavedPractice: boolean;
  state: RoleplayPathStepState;
  title: string;
}) {
  if (!hasSavedPractice) {
    return 'Finish the foundation lesson first so the app keeps one clear next step.';
  }

  if (state === 'done') {
    return 'Saved to your practice history. You can revisit it later from Practice.';
  }

  if (state === 'active') {
    return `The app chose ${title} as your next guided sprint. Save it to unlock the following work situation.`;
  }

  return 'Unlocks after you save the current guided sprint.';
}
