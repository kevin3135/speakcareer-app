import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario } from '../types';

export type ProgressNextStepGuide = {
  eyebrow: string;
  title: string;
  body: string;
  steps: string[];
  ctaLabel: string;
  roleplayId: RoleplayId;
};

type ProgressNextStepInput = {
  dailyTarget: DailyPracticeTarget;
  roleplays: Pick<RoleplayScenario, 'category' | 'focus' | 'id' | 'title'>[];
  sessions: PracticeSession[];
};

export function createProgressNextStepGuide({
  dailyTarget,
  roleplays,
  sessions,
}: ProgressNextStepInput): ProgressNextStepGuide {
  if (sessions.length === 0) {
    const firstRoleplay = roleplays[0];

    return {
      eyebrow: 'Start simple',
      title: 'Save your first answer',
      body: 'Do one short English roleplay first. Progress becomes useful after your first saved answer.',
      steps: ['Pick one work situation', 'Write 2-4 spoken sentences', 'Review feedback and save'],
      ctaLabel: firstRoleplay ? `Start ${firstRoleplay.title}` : 'Start Job Interview',
      roleplayId: firstRoleplay?.id ?? 'job-interview',
    };
  }

  const latestSession = sessions[0];
  const nextRoleplay = getNextRoleplay(latestSession.roleplayId, roleplays);
  const nextRoleplayTitle = nextRoleplay?.title ?? latestSession.roleplayTitle;
  const nextRoleplayId = nextRoleplay?.id ?? latestSession.roleplayId;
  const remainingSprints = Math.max(dailyTarget - sessions.length, 0);

  if (remainingSprints === 0) {
    return {
      eyebrow: 'Today is done',
      title: 'Daily target complete',
      body: `Your ${Math.min(sessions.length, dailyTarget)}/${dailyTarget} target is complete. Keep it light: review one correction or start an optional ${nextRoleplayTitle} sprint.`,
      steps: ['Read one saved feedback note', 'Repeat one correction out loud', 'Return tomorrow or do one extra sprint'],
      ctaLabel: 'Start optional sprint',
      roleplayId: nextRoleplayId,
    };
  }

  return {
    eyebrow: 'Next step',
    title: remainingSprints === 1 ? 'One more sprint today' : `${remainingSprints} sprints left today`,
    body: `Your ${latestSession.roleplayTitle} answer is saved. Keep the rhythm with ${nextRoleplayTitle}.`,
    steps: ['Review the feedback below', `Practice ${nextRoleplayTitle}`, 'Save one more answer for XP'],
    ctaLabel: 'Start next roleplay',
    roleplayId: nextRoleplayId,
  };
}

function getNextRoleplay(
  currentRoleplayId: RoleplayId,
  roleplays: Pick<RoleplayScenario, 'id' | 'title'>[],
) {
  if (roleplays.length === 0) {
    return null;
  }

  const currentIndex = roleplays.findIndex((roleplay) => roleplay.id === currentRoleplayId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % roleplays.length;

  return roleplays[nextIndex];
}
