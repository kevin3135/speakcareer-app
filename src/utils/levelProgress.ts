const XP_PER_LEVEL = 180;

export type LevelProgress = {
  currentLevelLabel: string;
  nextLevelLabel: string;
  progressLabel: string;
  progressPercent: number;
  totalXpLabel: string;
};

export function createLevelProgress(totalXp: number): LevelProgress {
  const safeXp = Math.max(0, Math.round(totalXp));
  const currentLevel = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const xpFloor = (currentLevel - 1) * XP_PER_LEVEL;
  const xpIntoLevel = safeXp - xpFloor;
  const xpRemaining = XP_PER_LEVEL - xpIntoLevel;

  return {
    currentLevelLabel: `Level ${currentLevel}`,
    nextLevelLabel: `${xpRemaining} XP to Level ${currentLevel + 1}`,
    progressLabel: `${xpIntoLevel}/${XP_PER_LEVEL} XP`,
    progressPercent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
    totalXpLabel: `${safeXp} total XP`,
  };
}
