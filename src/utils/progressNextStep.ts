import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';

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
  roleplays: Pick<RoleplayScenario, 'category' | 'durationMinutes' | 'id' | 'targetLevel' | 'title'>[];
  sessions: PracticeSession[];
};

export function createProgressNextStepGuide({
  dailyTarget,
  roleplays,
  sessions,
}: ProgressNextStepInput): ProgressNextStepGuide {
  const path = createPracticeCareerPath({ roleplays, sessions });

  if (sessions.length === 0) {
    return {
      eyebrow: 'Start simple',
      title: 'Save your first answer',
      body: 'Do one short English roleplay first. Progress becomes useful after your first saved answer.',
      steps: ['Pick one work situation', 'Write 2-4 spoken sentences', 'Review feedback and save'],
      ctaLabel: path.ctaLabel,
      roleplayId: path.roleplayId,
    };
  }

  const latestSession = sessions[0];
  const nextRoleplay = roleplays.find((roleplay) => roleplay.id === path.roleplayId);
  const nextRoleplayTitle = nextRoleplay?.title ?? latestSession.roleplayTitle;
  const nextRoleplayId = nextRoleplay?.id ?? latestSession.roleplayId;
  const completedRoleplayIds = new Set(sessions.map((session) => session.roleplayId));
  const firstIncompleteIndex = roleplays.findIndex(
    (roleplay) => !completedRoleplayIds.has(roleplay.id),
  );
  const latestRoleplayIndex = roleplays.findIndex(
    (roleplay) => roleplay.id === latestSession.roleplayId,
  );
  const isOffPathLatestSave =
    firstIncompleteIndex !== -1 && latestRoleplayIndex > firstIncompleteIndex;
  const remainingSprints = Math.max(dailyTarget - sessions.length, 0);

  if (remainingSprints === 0) {
    return {
      eyebrow: 'Today is done',
      title: 'Daily target complete',
      body: `Your ${Math.min(sessions.length, dailyTarget)}/${dailyTarget} target is complete. Keep it light: review one correction or do an optional ${nextRoleplayTitle} sprint.`,
      steps: ['Read one saved feedback note', 'Repeat one correction out loud', `${path.progressPercent === 100 ? 'Replay' : 'Practice'} ${nextRoleplayTitle}`],
      ctaLabel: path.ctaLabel,
      roleplayId: nextRoleplayId,
    };
  }

  return {
    eyebrow: 'Next step',
    title: remainingSprints === 1 ? 'One more sprint today' : `${remainingSprints} sprints left today`,
    body: isOffPathLatestSave
      ? `Your ${latestSession.roleplayTitle} answer is saved. Return to ${nextRoleplayTitle} so the guided path stays in sequence.`
      : `Your ${latestSession.roleplayTitle} answer is saved. Keep the rhythm with ${nextRoleplayTitle}.`,
    steps: [
      'Review the feedback below',
      `${isOffPathLatestSave ? 'Return to' : 'Practice'} ${nextRoleplayTitle}`,
      'Save one more answer for XP',
    ],
    ctaLabel: path.ctaLabel,
    roleplayId: nextRoleplayId,
  };
}
