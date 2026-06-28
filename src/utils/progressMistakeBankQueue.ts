import type { MistakeItem } from '../types';

export type ProgressMistakeBankQueueItem = {
  id: string;
  category: string;
  correction: string;
  isPracticed: boolean;
  statusLabel: string;
};

export type ProgressMistakeBankQueue = {
  body: string;
  eyebrow: string;
  items: ProgressMistakeBankQueueItem[];
  progressLabel: string;
  title: string;
};

const PRIORITY_ORDER: Record<MistakeItem['priority'], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export function createProgressMistakeBankQueue(
  mistakes: MistakeItem[],
  practicedMistakeIds: string[] = [],
): ProgressMistakeBankQueue | null {
  if (mistakes.length === 0) {
    return null;
  }

  const practicedMistakeIdSet = new Set(practicedMistakeIds);
  const prioritizedMistakes = [...mistakes].sort(
    (left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority],
  );
  const activeMistake = prioritizedMistakes.find(
    (mistake) => !practicedMistakeIdSet.has(mistake.id),
  ) ?? prioritizedMistakes[0];
  const upcomingItems = prioritizedMistakes.filter(
    (mistake) => mistake.id !== activeMistake.id && !practicedMistakeIdSet.has(mistake.id),
  );
  const practicedItems = prioritizedMistakes.filter(
    (mistake) => mistake.id !== activeMistake.id && practicedMistakeIdSet.has(mistake.id),
  );
  const queueItems = [...upcomingItems, ...practicedItems].map((mistake) => ({
    id: mistake.id,
    category: mistake.category,
    correction: mistake.correction,
    isPracticed: practicedMistakeIdSet.has(mistake.id),
    statusLabel: practicedMistakeIdSet.has(mistake.id) ? 'Done' : 'Next',
  }));
  const practicedCount = prioritizedMistakes.filter(
    (mistake) => practicedMistakeIdSet.has(mistake.id),
  ).length;
  const upcomingCount = upcomingItems.length;

  if (queueItems.length === 0) {
    return {
      body: 'This is your only saved correction for now. Reuse it in roleplay until the stronger sentence feels natural.',
      eyebrow: 'Correction queue',
      items: [],
      progressLabel: `${practicedCount}/${prioritizedMistakes.length} practiced`,
      title: 'No queued corrections yet',
    };
  }

  if (upcomingCount === 0) {
    return {
      body: 'You already repeated every saved correction once. Keep them warm with short roleplay sprints instead of reading a long list again.',
      eyebrow: 'Correction queue',
      items: queueItems,
      progressLabel: `${practicedCount}/${prioritizedMistakes.length} practiced`,
      title: 'All corrections practiced once',
    };
  }

  return {
    body: practicedCount === 0
      ? 'Stay with one active correction first. The rest wait here so Progress coaches one clear improvement at a time.'
      : 'Nice. Progress moved you to the next correction. The rest stay queued here instead of competing for attention.',
    eyebrow: 'Correction queue',
    items: queueItems,
    progressLabel: `${practicedCount}/${prioritizedMistakes.length} practiced`,
    title: `${upcomingCount} more ${upcomingCount === 1 ? 'correction' : 'corrections'} waiting`,
  };
}
