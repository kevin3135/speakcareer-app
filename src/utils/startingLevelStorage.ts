import type { StartingLevelId } from '../types';

export const STARTING_LEVEL_KEY = 'speakcareer:starting-level';
const DEFAULT_STARTING_LEVEL: StartingLevelId = 'basic';
const STARTING_LEVEL_IDS: StartingLevelId[] = ['starter', 'basic', 'confident'];

export type StartingLevelStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function parseStartingLevelValue(value: string | null): StartingLevelId {
  return STARTING_LEVEL_IDS.find((levelId) => levelId === value) ?? DEFAULT_STARTING_LEVEL;
}

export async function readStartingLevel(storage: StartingLevelStorage): Promise<StartingLevelId> {
  try {
    return parseStartingLevelValue(await storage.getItem(STARTING_LEVEL_KEY));
  } catch {
    return DEFAULT_STARTING_LEVEL;
  }
}

export async function saveStartingLevel(
  storage: StartingLevelStorage,
  startingLevelId: StartingLevelId,
): Promise<void> {
  await storage.setItem(STARTING_LEVEL_KEY, startingLevelId);
}
