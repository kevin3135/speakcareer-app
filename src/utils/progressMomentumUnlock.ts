export const DETAILED_PROGRESS_UNLOCK_TARGET = 3;

export type ProgressMomentumUnlockState = {
  body: string;
  eyebrow: string;
  items: string[];
  progressLabel: string;
  progressPercent: number;
  title: string;
};

export function createProgressMomentumUnlock(
  savedSessionsCount: number,
): ProgressMomentumUnlockState | null {
  const normalizedSavedSessions = Math.max(0, Math.floor(savedSessionsCount));

  if (
    normalizedSavedSessions === 0 ||
    normalizedSavedSessions >= DETAILED_PROGRESS_UNLOCK_TARGET
  ) {
    return null;
  }

  const remainingSaves = DETAILED_PROGRESS_UNLOCK_TARGET - normalizedSavedSessions;

  return {
    body: remainingSaves === 1
      ? 'One more saved answer opens the fuller wins view. Until then, keep Progress focused on the next sprint and one active correction.'
      : 'Progress stays intentionally narrow at the start so each saved answer leads to one clear next step instead of a full report.',
    eyebrow: 'Unlock next',
    items: [
      'Earlier saved coaching targets',
      'Skill trend and weekly rhythm',
      'Full correction queue',
    ],
    progressLabel: `${normalizedSavedSessions}/${DETAILED_PROGRESS_UNLOCK_TARGET} saved`,
    progressPercent: Math.round(
      (normalizedSavedSessions / DETAILED_PROGRESS_UNLOCK_TARGET) * 100,
    ),
    title: remainingSaves === 1
      ? 'One more save unlocks deeper wins'
      : `${remainingSaves} more saves unlock deeper wins`,
  };
}
