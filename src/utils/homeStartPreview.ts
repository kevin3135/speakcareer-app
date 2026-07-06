import type { DailyPracticeTarget } from '../types';

export type HomeStartPreview = {
  body: string;
  eyebrow: string;
  title: string;
};

type CreateHomeStartPreviewInput = {
  currentTitle: string;
  dailyTarget: DailyPracticeTarget;
  firstWinTomorrowPreview?: HomeStartPreview | null;
  hasCompletedFoundation: boolean;
  hasResumeDraft: boolean;
  isMissionComplete: boolean;
  nextUnlockTitle: string | null;
  targetSessionsCompleted: number;
};

export function createHomeStartPreview({
  currentTitle,
  dailyTarget,
  firstWinTomorrowPreview,
  hasCompletedFoundation,
  hasResumeDraft,
  isMissionComplete,
  nextUnlockTitle,
  targetSessionsCompleted,
}: CreateHomeStartPreviewInput): HomeStartPreview {
  const safeDailyTarget = Math.max(1, dailyTarget);
  const nextSavedCount = Math.min(targetSessionsCompleted + 1, safeDailyTarget);
  const remainingAfterSave = Math.max(safeDailyTarget - nextSavedCount, 0);
  const afterSaveLabel = `${nextSavedCount}/${safeDailyTarget} today`;
  const firstUnlockTitle = nextUnlockTitle ?? 'Job Interview';
  const saveSubject = hasResumeDraft ? 'Finishing this draft' : 'This save';

  if (!hasCompletedFoundation) {
    return {
      body: safeDailyTarget === 1
        ? 'Then one saved answer starts your streak and completes 1/1 today.'
        : `Then one saved answer gets you to ${afterSaveLabel} and opens the daily habit.`,
      eyebrow: 'After lesson',
      title: `${firstUnlockTitle} unlocks`,
    };
  }

  if (firstWinTomorrowPreview && !hasResumeDraft) {
    return firstWinTomorrowPreview;
  }

  if (isMissionComplete) {
    return {
      body: nextUnlockTitle
        ? `Today's target is already done. This extra save adds bonus XP while ${nextUnlockTitle} stays ready next.`
        : `Today's target is already done. This extra save adds bonus XP and keeps ${currentTitle} warm.`,
      eyebrow: 'Bonus after this',
      title: nextUnlockTitle ? `${nextUnlockTitle} stays ready` : 'Bonus XP banked',
    };
  }

  if (remainingAfterSave === 0) {
    return {
      body: targetSessionsCompleted === 0
        ? `Your first save starts your streak, opens Progress, and finishes ${afterSaveLabel}.`
        : nextUnlockTitle
          ? `${saveSubject} finishes ${afterSaveLabel} and unlocks ${nextUnlockTitle}.`
          : `${saveSubject} finishes ${afterSaveLabel} and locks in today's practice.`,
      eyebrow: 'After save',
      title: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : 'Today closes',
    };
  }

  const remainingLabel = remainingAfterSave === 1
    ? '1 more later'
    : `${remainingAfterSave} more later`;

  return {
    body: targetSessionsCompleted === 0
      ? `Your first save starts your streak, opens Progress, and moves you to ${afterSaveLabel}. ${remainingLabel}.`
      : `${saveSubject} moves you to ${afterSaveLabel}. ${remainingLabel}.`,
    eyebrow: 'After save',
    title: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : `${afterSaveLabel} saved`,
  };
}
