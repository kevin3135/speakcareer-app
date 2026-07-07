const XP_PER_LEVEL = 180;

export type PracticeLevelPayoffState = {
  afterSaveLevelLabel: string;
  afterSaveProgressLabel: string;
  afterSaveTotalXpLabel: string;
  badgeLabel: string;
  body: string;
  currentLevelLabel: string;
  currentProgressLabel: string;
  currentTotalXpLabel: string;
  progressLabel: string;
  progressPercent: number;
  title: string;
};

type CreatePracticeLevelPayoffInput = {
  currentTotalXp: number;
  xpReward: number;
};

export function createPracticeLevelPayoff({
  currentTotalXp,
  xpReward,
}: CreatePracticeLevelPayoffInput): PracticeLevelPayoffState {
  const safeCurrentTotalXp = Math.max(0, Math.round(currentTotalXp));
  const safeXpReward = Math.max(0, Math.round(xpReward));
  const afterSaveTotalXp = safeCurrentTotalXp + safeXpReward;

  const currentLevelNumber = Math.floor(safeCurrentTotalXp / XP_PER_LEVEL) + 1;
  const afterSaveLevelNumber = Math.floor(afterSaveTotalXp / XP_PER_LEVEL) + 1;
  const currentXpIntoLevel = safeCurrentTotalXp - (currentLevelNumber - 1) * XP_PER_LEVEL;
  const afterSaveXpIntoLevel = afterSaveTotalXp - (afterSaveLevelNumber - 1) * XP_PER_LEVEL;
  const didLevelUp = afterSaveLevelNumber > currentLevelNumber;
  const targetLevelNumber = didLevelUp ? afterSaveLevelNumber : currentLevelNumber + 1;

  const currentLevelLabel = `Level ${currentLevelNumber}`;
  const afterSaveLevelLabel = `Level ${afterSaveLevelNumber}`;
  const currentProgressLabel = `${currentXpIntoLevel}/${XP_PER_LEVEL} XP`;
  const afterSaveProgressLabel = `${afterSaveXpIntoLevel}/${XP_PER_LEVEL} XP`;

  if (didLevelUp) {
    return {
      afterSaveLevelLabel,
      afterSaveProgressLabel,
      afterSaveTotalXpLabel: `${afterSaveTotalXp} total XP`,
      badgeLabel: `+${safeXpReward} XP`,
      body:
        `Save this sprint to move from ${currentLevelLabel} at ${currentProgressLabel} ` +
        `to ${afterSaveLevelLabel} at ${afterSaveProgressLabel}.`,
      currentLevelLabel,
      currentProgressLabel,
      currentTotalXpLabel: `${safeCurrentTotalXp} total XP`,
      progressLabel: `${afterSaveLevelLabel} unlocked`,
      progressPercent: 100,
      title: `Reach ${afterSaveLevelLabel} with this save`,
    };
  }

  return {
    afterSaveLevelLabel,
    afterSaveProgressLabel,
    afterSaveTotalXpLabel: `${afterSaveTotalXp} total XP`,
    badgeLabel: `+${safeXpReward} XP`,
    body:
      `Save this sprint to move from ${currentProgressLabel} ` +
      `to ${afterSaveProgressLabel} toward Level ${targetLevelNumber}.`,
    currentLevelLabel,
    currentProgressLabel,
    currentTotalXpLabel: `${safeCurrentTotalXp} total XP`,
    progressLabel: `${afterSaveProgressLabel} after save`,
    progressPercent: Math.round((afterSaveXpIntoLevel / XP_PER_LEVEL) * 100),
    title: `Move closer to Level ${targetLevelNumber}`,
  };
}
