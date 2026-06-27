import type { PracticeSession } from '../types';
import type { PracticeCareerPath } from './practiceCareerPath';

export type PracticeMapStat = {
  label: string;
  value: string;
  tone: 'focus' | 'path' | 'reward';
};

type CreatePracticeMapStatsInput = {
  path: Pick<PracticeCareerPath, 'progressLabel'>;
  sessions: Pick<PracticeSession, 'xpReward'>[];
};

export function createPracticeMapStats({
  path,
  sessions,
}: CreatePracticeMapStatsInput): PracticeMapStat[] {
  const xpTotal = sessions.reduce((total, session) => total + session.xpReward, 0);

  return [
    {
      label: 'Streak',
      value: sessions.length > 0 ? `${Math.min(sessions.length, 7)} day` : '0 day',
      tone: 'focus',
    },
    {
      label: 'XP',
      value: xpTotal > 0 ? `${xpTotal}` : '+40',
      tone: 'reward',
    },
    {
      label: 'Path',
      value: path.progressLabel,
      tone: 'path',
    },
  ];
}
