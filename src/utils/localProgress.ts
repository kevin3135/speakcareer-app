import type { DailyPracticeTarget, PracticeSession, ProgressSummary } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeTimeline, type PracticeTimelineOptions } from './practiceTimeline.ts';

export type LocalProgressStats = {
  sessionsCompleted: number;
  minutesPracticed: number;
  currentStreakDays: number;
  targetSessionsCompleted: number;
  targetSessionsRemaining: number;
  targetCompletionPercent: number;
  totalLocalXp: number;
  totalCareerXp: number;
  xpToday: number;
  xpGoal: number;
  progressPercent: number;
};

const SPRINT_MINUTES = 5;
const XP_PER_TARGET_ROLEPLAY = 60;

export function createLocalProgressStats(
  summary: ProgressSummary,
  sessions: PracticeSession[],
  dailyTarget: DailyPracticeTarget = 1,
  options: PracticeTimelineOptions = {},
): LocalProgressStats {
  const timeline = createPracticeTimeline(sessions, options);
  const totalLocalXp = sessions.reduce((total, session) => total + session.xpReward, 0);
  const xpGoal = dailyTarget * XP_PER_TARGET_ROLEPLAY;
  const baseCareerXp = summary.sessionsCompleted * 40 + summary.minutesPracticed * 2;
  const baseXpToday = Math.min(xpGoal, summary.currentStreakDays * 12 + 18);
  const xpToday = Math.min(xpGoal, baseXpToday + timeline.todayXpTotal);
  const completedToday = Math.min(timeline.sessionsTodayCount, dailyTarget);

  return {
    sessionsCompleted: summary.sessionsCompleted + sessions.length,
    minutesPracticed: summary.minutesPracticed + sessions.length * SPRINT_MINUTES,
    currentStreakDays: summary.currentStreakDays + timeline.activeStreakDays,
    targetSessionsCompleted: completedToday,
    targetSessionsRemaining: Math.max(dailyTarget - completedToday, 0),
    targetCompletionPercent: Math.round((completedToday / dailyTarget) * 100),
    totalLocalXp,
    totalCareerXp: baseCareerXp + totalLocalXp,
    xpToday,
    xpGoal,
    progressPercent: Math.round((xpToday / xpGoal) * 100),
  };
}
