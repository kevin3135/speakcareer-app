import type { PracticeSession, ProgressSummary } from '../types';

export type LocalProgressStats = {
  sessionsCompleted: number;
  minutesPracticed: number;
  currentStreakDays: number;
  totalLocalXp: number;
  totalCareerXp: number;
  xpToday: number;
  xpGoal: number;
  progressPercent: number;
};

const SPRINT_MINUTES = 5;
const DAILY_XP_GOAL = 60;

export function createLocalProgressStats(
  summary: ProgressSummary,
  sessions: PracticeSession[],
): LocalProgressStats {
  const totalLocalXp = sessions.reduce((total, session) => total + session.xpReward, 0);
  const hasLocalPractice = sessions.length > 0;
  const baseCareerXp = summary.sessionsCompleted * 40 + summary.minutesPracticed * 2;
  const baseXpToday = Math.min(DAILY_XP_GOAL, summary.currentStreakDays * 12 + 18);
  const xpToday = Math.min(DAILY_XP_GOAL, baseXpToday + totalLocalXp);

  return {
    sessionsCompleted: summary.sessionsCompleted + sessions.length,
    minutesPracticed: summary.minutesPracticed + sessions.length * SPRINT_MINUTES,
    currentStreakDays: summary.currentStreakDays + (hasLocalPractice ? 1 : 0),
    totalLocalXp,
    totalCareerXp: baseCareerXp + totalLocalXp,
    xpToday,
    xpGoal: DAILY_XP_GOAL,
    progressPercent: Math.round((xpToday / DAILY_XP_GOAL) * 100),
  };
}
