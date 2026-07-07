import type { DailyPracticeTarget, PracticeSession, ProgressSummary } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeTimeline, type PracticeTimelineOptions } from './practiceTimeline.ts';

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
  dailyTarget: DailyPracticeTarget = 1,
  options: PracticeTimelineOptions = {},
): DailyMission {
  const timeline = createPracticeTimeline(sessions, options);
  const xpGoal = dailyTarget * 60;
  const totalLocalXp = sessions.reduce((total, session) => total + session.xpReward, 0);
  const xpTotal = summary.sessionsCompleted * 40 + summary.minutesPracticed * 2 + totalLocalXp;
  const xpToday = Math.min(xpGoal, summary.currentStreakDays * 12 + 18 + timeline.todayXpTotal);
  const streakDays = summary.currentStreakDays + timeline.activeStreakDays;
  const level = Math.max(1, Math.floor(xpTotal / 180) + 1);

  return {
    level,
    xpTotal,
    xpToday,
    xpGoal,
    streakDays,
    title: dailyTarget === 1
      ? 'Complete one career roleplay'
      : `Complete ${dailyTarget} career roleplays`,
    rewardLabel: sessions[0] ? `+${sessions[0].xpReward} XP` : '+40 XP',
    progressPercent: Math.round((xpToday / xpGoal) * 100),
  };
}
