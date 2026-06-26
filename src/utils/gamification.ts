import type { ProgressSummary } from '../types';

export type DailyMission = {
  level: number;
  xpTotal: number;
  xpToday: number;
  xpGoal: number;
  streakDays: number;
  title: string;
  rewardLabel: string;
  progressPercent: number;
};

export function createDailyMission(summary: ProgressSummary): DailyMission {
  const xpTotal = summary.sessionsCompleted * 40 + summary.minutesPracticed * 2;
  const level = Math.max(1, Math.floor(xpTotal / 180) + 1);
  const xpGoal = 60;
  const xpToday = Math.min(xpGoal, summary.currentStreakDays * 12 + 18);

  return {
    level,
    xpTotal,
    xpToday,
    xpGoal,
    streakDays: summary.currentStreakDays,
    title: 'Complete one career roleplay',
    rewardLabel: '+40 XP',
    progressPercent: Math.round((xpToday / xpGoal) * 100),
  };
}
