export const PRACTICED_MISTAKE_IDS_KEY = 'speakcareer:practiced-mistake-ids';

export type MistakePracticeStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function normalizePracticedMistakeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

export async function readPracticedMistakeIds(
  storage: MistakePracticeStorage,
): Promise<string[]> {
  try {
    const storedValue = await storage.getItem(PRACTICED_MISTAKE_IDS_KEY);

    return normalizePracticedMistakeIds(storedValue ? JSON.parse(storedValue) : []);
  } catch {
    return [];
  }
}

export async function savePracticedMistakeIds(
  storage: MistakePracticeStorage,
  practicedMistakeIds: string[],
): Promise<void> {
  const safeIds = [...new Set(normalizePracticedMistakeIds(practicedMistakeIds))];

  await storage.setItem(PRACTICED_MISTAKE_IDS_KEY, JSON.stringify(safeIds));
}
