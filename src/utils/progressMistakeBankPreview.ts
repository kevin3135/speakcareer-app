import type { MistakeItem } from '../types';

export type ProgressMistakeBankPreview = {
  body: string;
  eyebrow: string;
  previewCategory: string;
  previewCorrection: string;
  previewLabel: string;
  previewNote: string;
  progressLabel: string;
  title: string;
  totalPatternsLabel: string;
};

const PRIORITY_ORDER: Record<MistakeItem['priority'], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export function createProgressMistakeBankPreview(
  mistakes: MistakeItem[],
): ProgressMistakeBankPreview | null {
  if (mistakes.length === 0) {
    return null;
  }

  const topMistake = [...mistakes].sort(
    (left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority],
  )[0];

  return {
    body: 'Save one roleplay answer to unlock your full mistake bank and reuse better English patterns in later sprints.',
    eyebrow: 'Locked until first save',
    previewCategory: topMistake.category,
    previewCorrection: topMistake.correction,
    previewLabel: 'Say this next time',
    previewNote: topMistake.note,
    progressLabel: '0/1 saved',
    title: 'Your first correction is ready',
    totalPatternsLabel: `${mistakes.length} patterns ready after unlock`,
  };
}
