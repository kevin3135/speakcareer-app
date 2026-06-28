export const FOUNDATION_PROGRESS_KEY = 'speakcareer:foundation-progress';
export const FOUNDATION_TOTAL_STEPS = 3;

export type FoundationProgressStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function normalizeFoundationProgressValue(
  value: number,
  totalSteps = FOUNDATION_TOTAL_STEPS,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(value), 0), totalSteps);
}

export function parseFoundationProgressValue(
  value: string | null,
  totalSteps = FOUNDATION_TOTAL_STEPS,
): number {
  if (value === null) {
    return 0;
  }

  return normalizeFoundationProgressValue(Number.parseInt(value, 10), totalSteps);
}

export async function readFoundationProgress(
  storage: FoundationProgressStorage,
  totalSteps = FOUNDATION_TOTAL_STEPS,
): Promise<number> {
  try {
    return parseFoundationProgressValue(
      await storage.getItem(FOUNDATION_PROGRESS_KEY),
      totalSteps,
    );
  } catch {
    return 0;
  }
}

export async function saveFoundationProgress(
  storage: FoundationProgressStorage,
  completedSteps: number,
  totalSteps = FOUNDATION_TOTAL_STEPS,
): Promise<void> {
  const safeCompletedSteps = normalizeFoundationProgressValue(completedSteps, totalSteps);

  await storage.setItem(FOUNDATION_PROGRESS_KEY, safeCompletedSteps.toString());
}
