import type { DailyPracticeTarget, PracticeSession, ProgressSummary } from '../types';

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
): LocalProgressStats {
  const totalLocalXp = sessions.reduce((total, session) => total + session.xpReward, 0);
  const hasLocalPractice = sessions.length > 0;
  const xpGoal = dailyTarget * XP_PER_TARGET_ROLEPLAY;
  const baseCareerXp = summary.sessionsCompleted * 40 + summary.minutesPracticed * 2;
  const baseXpToday = Math.min(xpGoal, summary.currentStreakDays * 12 + 18);
  const xpToday = Math.min(xpGoal, baseXpToday + totalLocalXp);

  return {
    sessionsCompleted: summary.sessionsCompleted + sessions.length,
    minutesPracticed: summary.minutesPracticed + sessions.length * SPRINT_MINUTES,
    currentStreakDays: summary.currentStreakDays + (hasLocalPractice ? 1 : 0),
    targetSessionsCompleted: Math.min(sessions.length, dailyTarget),
    targetSessionsRemaining: Math.max(dailyTarget - sessions.length, 0),
    targetCompletionPercent: Math.round((Math.min(sessions.length, dailyTarget) / dailyTarget) * 100),
    totalLocalXp,
    totalCareerXp: baseCareerXp + totalLocalXp,
    xpToday,
    xpGoal,
    progressPercent: Math.round((xpToday / xpGoal) * 100),
  };
}
