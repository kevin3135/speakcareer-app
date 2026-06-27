import type { DailyPracticeTarget, PracticeSession } from '../types';
import type { DailyMission } from './gamification';
import type { LocalProgressStats } from './localProgress';

type HomeDailyMissionInput = {
  dailyMission: DailyMission;
  dailyTarget: DailyPracticeTarget;
  localProgress: LocalProgressStats;
  sessions: Pick<PracticeSession, 'id'>[];
};

export type HomeDailyMissionCard = {
  body: string;
  meta: string;
  progressLabel: string;
  progressPercent: number;
  reason: string;
  rewardLabel: string;
  targetLabel: string;
  title: string;
};

export function createHomeDailyMissionCard({
  dailyMission,
  dailyTarget,
  localProgress,
  sessions,
}: HomeDailyMissionInput): HomeDailyMissionCard {
  const completed = Math.min(sessions.length, dailyTarget);
  const remaining = Math.max(dailyTarget - completed, 0);
  const targetLabel = `${completed}/${dailyTarget} saved`;

  if (completed === 0) {
    return {
      body: 'Finish the short foundation step, then save one guided answer to start your streak.',
      meta: '5-minute sprint',
      progressLabel: 'Mission progress',
      progressPercent: 0,
      reason: 'A small daily answer makes real interview English easier when it matters.',
      rewardLabel: dailyMission.rewardLabel,
      targetLabel,
      title: 'Save your first practice answer',
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
