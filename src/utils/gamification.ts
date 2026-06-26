import type { PracticeSession, ProgressSummary } from '../types';

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

export function createDailyMission(
  summary: ProgressSummary,
  sessions: PracticeSession[] = [],
): DailyMission {
  const xpGoal = 60;
  const totalLocalXp = sessions.reduce((total, session) => total + session.xpReward, 0);
  const xpTotal = summary.sessionsCompleted * 40 + summary.minutesPracticed * 2 + totalLocalXp;
  const xpToday = Math.min(xpGoal, summary.currentStreakDays * 12 + 18 + totalLocalXp);
  const streakDays = summary.currentStreakDays + (sessions.length > 0 ? 1 : 0);
  const level = Math.max(1, Math.floor(xpTotal / 180) + 1);

  return {
    level,
    xpTotal,
    xpToday,
    xpGoal,
    streakDays,
    title: 'Complete one career roleplay',
    rewardLabel: sessions[0] ? `+${sessions[0].xpReward} XP` : '+40 XP',
    progressPercent: Math.round((xpToday / xpGoal) * 100),
  };
}
