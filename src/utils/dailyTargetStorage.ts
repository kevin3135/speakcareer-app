import type { DailyPracticeTarget } from '../types';

export const DAILY_TARGET_KEY = 'speakcareer:daily-target';
export const DEFAULT_DAILY_TARGET: DailyPracticeTarget = 1;

export type DailyTargetStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function parseDailyTargetValue(value: string | null): DailyPracticeTarget {
  if (value === '2') {
    return 2;
  }

  if (value === '3') {
    return 3;
  }

  return DEFAULT_DAILY_TARGET;
}

export async function readDailyTarget(storage: DailyTargetStorage): Promise<DailyPracticeTarget> {
  try {
    return parseDailyTargetValue(await storage.getItem(DAILY_TARGET_KEY));
  } catch {
    return DEFAULT_DAILY_TARGET;
  }
}

export async function saveDailyTarget(
  storage: DailyTargetStorage,
  target: DailyPracticeTarget,
): Promise<void> {
  await storage.setItem(DAILY_TARGET_KEY, String(target));
}
