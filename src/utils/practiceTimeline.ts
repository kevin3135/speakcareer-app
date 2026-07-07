import type { PracticeSession } from '../types';

export type PracticeTimeline = {
  activeStreakDays: number;
  sessionsTodayCount: number;
  todayXpTotal: number;
};

export type PracticeTimelineOptions = {
  now?: Date;
};

type TimelineSession = Pick<PracticeSession, 'completedAt' | 'xpReward'>;

export function createPracticeTimeline(
  sessions: TimelineSession[],
  options: PracticeTimelineOptions = {},
): PracticeTimeline {
  const now = options.now ?? new Date();
  const todayKey = toPracticeDayKey(now);
  const yesterdayKey = toPracticeDayKey(addDays(now, -1));
  const dayKeys = new Set<string>();
  let sessionsTodayCount = 0;
  let todayXpTotal = 0;

  if (!todayKey || !yesterdayKey) {
    return {
      activeStreakDays: 0,
      sessionsTodayCount,
      todayXpTotal,
    };
  }

  sessions.forEach((session) => {
    const dayKey = toPracticeDayKey(session.completedAt);

    if (!dayKey) {
      return;
    }

    dayKeys.add(dayKey);

    if (dayKey === todayKey) {
      sessionsTodayCount += 1;
      todayXpTotal += Math.max(0, session.xpReward);
    }
  });

  const activeAnchor = dayKeys.has(todayKey)
    ? now
    : dayKeys.has(yesterdayKey)
      ? addDays(now, -1)
      : null;

  return {
    activeStreakDays: activeAnchor ? countConsecutivePracticeDays(dayKeys, activeAnchor) : 0,
    sessionsTodayCount,
    todayXpTotal,
  };
}

function countConsecutivePracticeDays(dayKeys: Set<string>, anchorDate: Date) {
  let streakDays = 0;
  let offset = 0;

  while (true) {
    const dayKey = toPracticeDayKey(addDays(anchorDate, -offset));

    if (!dayKey || !dayKeys.has(dayKey)) {
      break;
    }

    streakDays += 1;
    offset += 1;
  }

  return streakDays;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function toPracticeDayKey(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
