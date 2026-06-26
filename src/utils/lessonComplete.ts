import type { PracticeSession } from '../types';

export type LessonCompleteSummary = {
  latestSession: PracticeSession;
  totalLocalXp: number;
  nextAction: string;
};

export function createLessonCompleteSummary(
  sessions: PracticeSession[],
): LessonCompleteSummary | null {
  if (sessions.length === 0) {
    return null;
  }

  const latestSession = sessions[0];
  const totalLocalXp = sessions.reduce((total, session) => total + session.xpReward, 0);

  return {
    latestSession,
    totalLocalXp,
    nextAction: createNextAction(latestSession),
  };
}

function createNextAction(session: PracticeSession) {
  if (session.xpReward >= 60) {
    return 'Keep the streak alive with one new roleplay sprint.';
  }

  if (session.wordCount < 35) {
    return 'Next time, add one result or next step to make the answer stronger.';
  }

  return 'Review one mistake, then try another workplace scenario.';
}
