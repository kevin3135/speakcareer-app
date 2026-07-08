import type { DailyPracticeTarget, PracticeSession } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeTimeline } from './practiceTimeline.ts';

export type PracticeDailySprintState = {
  afterSavePayoff: string;
  body: string;
  eyebrow: string;
  progressLabel: string;
  progressPercent: number;
  rewardLabel: string;
  statusLabel: string;
  statusTone: 'accent' | 'info' | 'success';
  streakBadgeLabel: string;
  streakLabel: string;
  streakText: string;
  title: string;
};

type CreatePracticeDailySprintInput = {
  dailyTarget: DailyPracticeTarget;
  isResumeMode: boolean;
  nextUnlockTitle?: string | null;
  now?: Date;
  recommendedRoleplayTitle: string;
  recommendedXpLabel: string;
  sessions: Pick<PracticeSession, 'completedAt'>[];
  streakDays: number;
};

export function createPracticeDailySprint({
  dailyTarget,
  isResumeMode,
  nextUnlockTitle,
  now,
  recommendedRoleplayTitle,
  recommendedXpLabel,
  sessions,
  streakDays,
}: CreatePracticeDailySprintInput): PracticeDailySprintState {
  const timeline = createPracticeTimeline(
    sessions.map((session) => ({
      completedAt: session.completedAt,
      xpReward: 0,
    })),
    { now },
  );
  const completed = Math.min(timeline.sessionsTodayCount, dailyTarget);
  const nextSavedCount = Math.min(completed + 1, dailyTarget);
  const progressPercent = Math.round((completed / dailyTarget) * 100);
  const progressLabel = `${completed}/${dailyTarget} saved today`;
  const streakCue = createPracticeStreakCue({
    completed,
    dailyTarget,
    hasActiveStreak: streakDays > 0,
    streakDays,
  });

  if (isResumeMode) {
    return {
      afterSavePayoff: completed >= dailyTarget
        ? 'Bonus XP banked'
        : createAfterSavePayoff(nextSavedCount, dailyTarget, nextUnlockTitle),
      body: completed >= dailyTarget
        ? `Today's target is already done. Save ${recommendedRoleplayTitle} for bonus XP and a cleaner practice record.`
        : `Finish and save ${recommendedRoleplayTitle} to move to ${nextSavedCount}/${dailyTarget} today and ${createStreakActionCopy({
          streakDays,
          variant: 'alive',
        })}.`,
      eyebrow: completed >= dailyTarget ? 'Saved draft ready' : 'Finish today',
      progressLabel,
      progressPercent,
      rewardLabel: recommendedXpLabel,
      statusLabel: completed >= dailyTarget ? 'Bonus save' : `${nextSavedCount}/${dailyTarget} after save`,
      statusTone: completed >= dailyTarget ? 'success' : 'accent',
      streakBadgeLabel: streakCue.badgeLabel,
      streakLabel: streakCue.label,
      streakText: streakCue.text,
      title: `Save ${recommendedRoleplayTitle}`,
    };
  }

  if (completed === 0) {
    return {
      afterSavePayoff: createAfterSavePayoff(nextSavedCount, dailyTarget, nextUnlockTitle),
      body: nextUnlockTitle
        ? `Save ${recommendedRoleplayTitle} first to ${createStreakActionCopy({
          streakDays,
          variant: 'start',
        })} and unlock ${nextUnlockTitle}.`
        : `Save ${recommendedRoleplayTitle} first to ${createStreakActionCopy({
          streakDays,
          variant: 'start',
        })} and log today's practice.`,
      eyebrow: "Today's sprint",
      progressLabel,
      progressPercent,
      rewardLabel: recommendedXpLabel,
      statusLabel: nextUnlockTitle ? `Then ${nextUnlockTitle}` : 'First save',
      statusTone: 'accent',
      streakBadgeLabel: streakCue.badgeLabel,
      streakLabel: streakCue.label,
      streakText: streakCue.text,
      title: "Start today's practice",
    };
  }

  if (completed < dailyTarget) {
    const remaining = dailyTarget - completed;

    return {
      afterSavePayoff: createAfterSavePayoff(nextSavedCount, dailyTarget, nextUnlockTitle),
      body: nextUnlockTitle
        ? `Save ${recommendedRoleplayTitle} to reach ${nextSavedCount}/${dailyTarget} today and keep the path moving toward ${nextUnlockTitle}.`
        : `Save ${recommendedRoleplayTitle} to reach ${nextSavedCount}/${dailyTarget} today and ${createStreakActionCopy({
          streakDays,
          variant: 'moving',
        })}.`,
      eyebrow: "Today's sprint",
      progressLabel,
      progressPercent,
      rewardLabel: recommendedXpLabel,
      statusLabel: remaining === 1 ? 'Finish target' : `${remaining} left`,
      statusTone: remaining === 1 ? 'success' : 'info',
      streakBadgeLabel: streakCue.badgeLabel,
      streakLabel: streakCue.label,
      streakText: streakCue.text,
      title: remaining === 1 ? 'One more save finishes today' : 'Keep today moving',
    };
  }

  return {
    afterSavePayoff: nextUnlockTitle ? `Bonus XP, faster path to ${nextUnlockTitle}` : 'Bonus XP banked',
    body: nextUnlockTitle
      ? `Today's target is done. Save ${recommendedRoleplayTitle} next when you want extra XP and a faster path to ${nextUnlockTitle}.`
      : `Today's target is done. Save ${recommendedRoleplayTitle} next when you want extra XP and another short English rep.`,
    eyebrow: 'Target complete',
    progressLabel,
    progressPercent,
    rewardLabel: recommendedXpLabel,
    statusLabel: 'Bonus XP',
    statusTone: 'success',
    streakBadgeLabel: streakCue.badgeLabel,
    streakLabel: streakCue.label,
    streakText: streakCue.text,
    title: 'Extra practice available',
  };
}

function createPracticeStreakCue({
  completed,
  dailyTarget,
  hasActiveStreak,
  streakDays,
}: {
  completed: number;
  dailyTarget: DailyPracticeTarget;
  hasActiveStreak: boolean;
  streakDays: number;
}) {
  if (!hasActiveStreak) {
    return {
      badgeLabel: 'New streak',
      label: 'Habit loop',
      text: completed >= dailyTarget
        ? 'First save is already banked today.'
        : 'First save starts a 1 day streak.',
    };
  }

  const badgeLabel = `${streakDays} day streak`;

  if (completed === 0) {
    return {
      badgeLabel,
      label: 'Streak on the line',
      text: `Save once today to keep ${badgeLabel.toLowerCase()} active.`,
    };
  }

  if (completed >= dailyTarget) {
    return {
      badgeLabel,
      label: 'Habit protected',
      text: `${badgeLabel} is protected today. Bonus practice is optional.`,
    };
  }

  return {
    badgeLabel,
    label: completed === dailyTarget - 1 ? 'Finish with momentum' : 'Habit active',
    text: `${badgeLabel} is active. Save again if you want another short rep today.`,
  };
}

function createAfterSavePayoff(
  nextSavedCount: number,
  dailyTarget: DailyPracticeTarget,
  nextUnlockTitle?: string | null,
) {
  if (nextSavedCount >= dailyTarget) {
    return nextUnlockTitle ? `Target complete, ${nextUnlockTitle} unlocks` : 'Target complete';
  }

  return nextUnlockTitle
    ? `${nextSavedCount}/${dailyTarget} saved, ${nextUnlockTitle} next`
    : `${nextSavedCount}/${dailyTarget} saved today`;
}

function createStreakActionCopy({
  streakDays,
  variant,
}: {
  streakDays: number;
  variant: 'alive' | 'moving' | 'start';
}) {
  if (streakDays <= 0) {
    return variant === 'moving' ? 'keep your streak moving' : 'start your streak';
  }

  if (variant === 'moving') {
    return `keep your ${streakDays} day streak moving`;
  }

  return `keep your ${streakDays} day streak active`;
}
