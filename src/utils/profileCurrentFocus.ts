import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';

type ProfileCurrentFocusRoleplay = Pick<
  RoleplayScenario,
  'category' | 'durationMinutes' | 'id' | 'targetLevel' | 'title'
>;

export type ProfileCurrentFocus = {
  badgeLabel: string;
  body: string;
  ctaLabel: string;
  eyebrow: string;
  metaLabel: string;
  progressLabel: string;
  progressPercent: number;
  roleplayId: RoleplayId;
  title: string;
};

type CreateProfileCurrentFocusInput = {
  dailyTarget: DailyPracticeTarget;
  roleplays: ProfileCurrentFocusRoleplay[];
  sessions: Pick<PracticeSession, 'roleplayId'>[];
};

export function createProfileCurrentFocus({
  dailyTarget,
  roleplays,
  sessions,
}: CreateProfileCurrentFocusInput): ProfileCurrentFocus {
  const path = createPracticeCareerPath({ roleplays, sessions });
  const roleplay = roleplays.find((item) => item.id === path.roleplayId) ?? roleplays[0];
  const completedToday = Math.min(sessions.length, dailyTarget);
  const isDailyTargetComplete = completedToday >= dailyTarget;
  const safeTitle = roleplay?.title ?? 'Job Interview';

  return {
    badgeLabel: isDailyTargetComplete ? 'Target done' : `${completedToday}/${dailyTarget} today`,
    body: createBody({
      isDailyTargetComplete,
      safeTitle,
      sessionsCount: sessions.length,
    }),
    ctaLabel: path.ctaLabel,
    eyebrow: 'Current focus',
    metaLabel: roleplay
      ? `${roleplay.category} | ${roleplay.targetLevel} | ${roleplay.durationMinutes} min`
      : 'Interview | B1-B2 | 5 min',
    progressLabel: path.progressLabel,
    progressPercent: path.progressPercent,
    roleplayId: path.roleplayId,
    title: path.title,
  };
}

function createBody({
  isDailyTargetComplete,
  safeTitle,
  sessionsCount,
}: {
  isDailyTargetComplete: boolean;
  safeTitle: string;
  sessionsCount: number;
}) {
  if (isDailyTargetComplete) {
    return `Target done. Optional ${safeTitle} keeps today's correction fresh.`;
  }

  if (sessionsCount === 0) {
    return `Start ${safeTitle} to save your first workplace answer.`;
  }

  return `Use ${safeTitle} for your next short work rep.`;
}
