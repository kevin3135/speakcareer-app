import type { DailyPracticeTarget, PracticeSession, RoleplayId, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeTimeline } from './practiceTimeline.ts';

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
  now?: Date;
  roleplays: ProfileCurrentFocusRoleplay[];
  sessions: Pick<PracticeSession, 'completedAt' | 'roleplayId'>[];
};

export function createProfileCurrentFocus({
  dailyTarget,
  now,
  roleplays,
  sessions,
}: CreateProfileCurrentFocusInput): ProfileCurrentFocus {
  const path = createPracticeCareerPath({ roleplays, sessions });
  const roleplay = roleplays.find((item) => item.id === path.roleplayId) ?? roleplays[0];
  const completedToday = Math.min(
    createPracticeTimeline(
      sessions.map((session) => ({
        completedAt: session.completedAt,
        xpReward: 0,
      })),
      { now },
    ).sessionsTodayCount,
    dailyTarget,
  );
  const isDailyTargetComplete = completedToday >= dailyTarget;
  const safeTitle = roleplay?.title ?? 'Job Interview';

  return {
    badgeLabel: isDailyTargetComplete ? 'Target done' : `${completedToday}/${dailyTarget} today`,
    body: createBody({
      completedToday,
      isDailyTargetComplete,
      hasSavedPractice: sessions.length > 0,
      safeTitle,
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
  completedToday,
  isDailyTargetComplete,
  hasSavedPractice,
  safeTitle,
}: {
  completedToday: number;
  isDailyTargetComplete: boolean;
  hasSavedPractice: boolean;
  safeTitle: string;
}) {
  if (isDailyTargetComplete) {
    return `Target done. Optional ${safeTitle} keeps today's correction fresh.`;
  }

  if (!hasSavedPractice) {
    return `Start ${safeTitle} to save your first workplace answer.`;
  }

  if (completedToday === 0) {
    return `Start ${safeTitle} for today's first short work rep.`;
  }

  return `Use ${safeTitle} for your next short work rep today.`;
}
