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
  const lockedItems = normalizedSavedSessions === DETAILED_PROGRESS_UNLOCK_TARGET - 1
    ? [
      'Skill trend and weekly rhythm',
      'Full correction queue',
    ]
    : [
      'Earlier saved coaching targets',
      'Skill trend and weekly rhythm',
      'Full correction queue',
    ];

  return {
    body: remainingSaves === 1
      ? 'Your earlier coaching target is already live below. One more saved answer opens skill trend and the full correction queue.'
      : 'Progress stays intentionally narrow at the start so each saved answer leads to one clear next step instead of a full report.',
    eyebrow: 'Unlock next',
    items: lockedItems,
    progressLabel: `${normalizedSavedSessions}/${DETAILED_PROGRESS_UNLOCK_TARGET} saved`,
    progressPercent: Math.round(
      (normalizedSavedSessions / DETAILED_PROGRESS_UNLOCK_TARGET) * 100,
    ),
    title: remainingSaves === 1
      ? 'One more save unlocks deeper wins'
      : `${remainingSaves} more saves unlock deeper wins`,
  };
}
