import type { DailyPracticeTarget, PracticeSession } from '../types';
import type { DailyMission } from './gamification';
import type { LocalProgressStats } from './localProgress';

type HomeDailyMissionInput = {
  dailyMission: DailyMission;
  dailyTarget: DailyPracticeTarget;
  hasCompletedFoundation: boolean;
  localProgress: LocalProgressStats;
  sessions: Pick<PracticeSession, 'id'>[];
};

export type HomeDailyMissionCard = {
  body: string;
  meta: string;
  progressLabel: string;
  progressPercent: number;
  reason: string;
  restartCue?: {
    label: string;
    value: string;
  };
  rewardLabel: string;
  targetLabel: string;
  title: string;
};

export function createHomeDailyMissionCard({
  dailyMission,
  dailyTarget,
  hasCompletedFoundation,
  localProgress,
  sessions,
}: HomeDailyMissionInput): HomeDailyMissionCard {
  const completed = localProgress.targetSessionsCompleted;
  const remaining = Math.max(dailyTarget - completed, 0);
  const targetLabel = `${completed}/${dailyTarget} saved`;
  const hasSavedPractice = sessions.length > 0;

  if (completed === 0) {
    return {
      body: hasSavedPractice
        ? 'New day. Save one guided answer now to keep the streak active.'
        : hasCompletedFoundation
          ? 'Foundation is done. Save one guided answer now to start your streak.'
          : 'Finish the short foundation step, then save one guided answer to start your streak.',
      meta: hasSavedPractice ? 'Fresh start' : '5-minute sprint',
      progressLabel: 'Mission progress',
      progressPercent: 0,
      reason: 'A small daily answer makes real interview English easier when it matters.',
      restartCue: hasSavedPractice
        ? {
          label: 'Fresh day',
          value: `Earlier wins stay saved. Today starts at ${targetLabel}.`,
        }
        : undefined,
      rewardLabel: dailyMission.rewardLabel,
      targetLabel,
      title: hasSavedPractice ? "Start today's mission" : 'Save your first practice answer',
    };
  }

  if (remaining === 0) {
    return {
      body: 'Your English practice is saved. Start another roleplay only if you want extra reps.',
      meta: 'Done today',
      progressLabel: 'Mission complete',
      progressPercent: 100,
      reason: 'You kept the habit alive with one focused workplace answer.',
      rewardLabel: dailyMission.rewardLabel,
      targetLabel,
      title: "Today's mission complete",
    };
  }

  return {
    body: `You saved ${completed} short practice${completed === 1 ? '' : 's'}. Finish ${remaining} more to hit today's target.`,
    meta: `${remaining} left`,
    progressLabel: 'Mission progress',
    progressPercent: localProgress.targetCompletionPercent,
    reason: 'Short, repeated practice builds confidence for real workplace conversations.',
    rewardLabel: dailyMission.rewardLabel,
    targetLabel,
    title: "Finish today's mission",
  };
}
