import type { DailyPracticeTarget, PracticeSession } from '../types';

export type PracticeDailySprintState = {
  body: string;
  eyebrow: string;
  progressLabel: string;
  progressPercent: number;
  rewardLabel: string;
  statusLabel: string;
  statusTone: 'accent' | 'info' | 'success';
  title: string;
};

type CreatePracticeDailySprintInput = {
  dailyTarget: DailyPracticeTarget;
  isResumeMode: boolean;
  nextUnlockTitle?: string | null;
  recommendedRoleplayTitle: string;
  recommendedXpLabel: string;
  sessions: Pick<PracticeSession, 'id'>[];
};

export function createPracticeDailySprint({
  dailyTarget,
  isResumeMode,
  nextUnlockTitle,
  recommendedRoleplayTitle,
  recommendedXpLabel,
  sessions,
}: CreatePracticeDailySprintInput): PracticeDailySprintState {
  const completed = Math.min(sessions.length, dailyTarget);
  const nextSavedCount = Math.min(completed + 1, dailyTarget);
  const progressPercent = Math.round((completed / dailyTarget) * 100);
  const progressLabel = `${completed}/${dailyTarget} saved today`;

  if (isResumeMode) {
    return {
      body: completed >= dailyTarget
        ? `Today's target is already done. Save ${recommendedRoleplayTitle} for bonus XP and a cleaner practice record.`
        : `Finish and save ${recommendedRoleplayTitle} to move to ${nextSavedCount}/${dailyTarget} today and keep your streak alive.`,
      eyebrow: completed >= dailyTarget ? 'Saved draft ready' : 'Finish today',
      progressLabel,
      progressPercent,
      rewardLabel: recommendedXpLabel,
      statusLabel: completed >= dailyTarget ? 'Bonus save' : `${nextSavedCount}/${dailyTarget} after save`,
      statusTone: completed >= dailyTarget ? 'success' : 'accent',
      title: `Save ${recommendedRoleplayTitle}`,
    };
  }

  if (completed === 0) {
    return {
      body: nextUnlockTitle
        ? `Save ${recommendedRoleplayTitle} first to start your streak and unlock ${nextUnlockTitle}.`
        : `Save ${recommendedRoleplayTitle} first to start your streak and log today's practice.`,
      eyebrow: "Today's sprint",
      progressLabel,
      progressPercent,
      rewardLabel: recommendedXpLabel,
      statusLabel: nextUnlockTitle ? `Then ${nextUnlockTitle}` : 'First save',
      statusTone: 'accent',
      title: "Start today's practice",
    };
  }

  if (completed < dailyTarget) {
    const remaining = dailyTarget - completed;

    return {
      body: nextUnlockTitle
        ? `Save ${recommendedRoleplayTitle} to reach ${nextSavedCount}/${dailyTarget} today and keep the path moving toward ${nextUnlockTitle}.`
        : `Save ${recommendedRoleplayTitle} to reach ${nextSavedCount}/${dailyTarget} today and keep your streak moving.`,
      eyebrow: "Today's sprint",
      progressLabel,
      progressPercent,
      rewardLabel: recommendedXpLabel,
      statusLabel: remaining === 1 ? 'Finish target' : `${remaining} left`,
      statusTone: remaining === 1 ? 'success' : 'info',
      title: remaining === 1 ? 'One more save finishes today' : 'Keep today moving',
    };
  }

  return {
    body: nextUnlockTitle
      ? `Today's target is done. Save ${recommendedRoleplayTitle} next when you want extra XP and a faster path to ${nextUnlockTitle}.`
      : `Today's target is done. Save ${recommendedRoleplayTitle} next when you want extra XP and another short English rep.`,
    eyebrow: 'Target complete',
    progressLabel,
    progressPercent,
    rewardLabel: recommendedXpLabel,
    statusLabel: 'Bonus XP',
    statusTone: 'success',
    title: 'Extra practice available',
  };
}
