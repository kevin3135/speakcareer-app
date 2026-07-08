import type { DailyPracticeTarget } from '../types';

export type HomeStartPreview = {
  eyebrow: string;
  rows: HomeStartPreviewRow[];
  title: string;
};

export type HomeStartPreviewRow = {
  label: string;
  value: string;
};

type CreateHomeStartPreviewInput = {
  currentTitle: string;
  dailyTarget: DailyPracticeTarget;
  firstWinTomorrowPreview?: Pick<HomeStartPreview, 'eyebrow' | 'title'> | null;
  hasCompletedFoundation: boolean;
  hasResumeDraft: boolean;
  isMissionComplete: boolean;
  nextUnlockTitle: string | null;
  resumeDraftCoachText?: string | null;
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
  resumeDraftCoachText,
  targetSessionsCompleted,
}: CreateHomeStartPreviewInput): HomeStartPreview {
  const safeDailyTarget = Math.max(1, dailyTarget);
  const nextSavedCount = Math.min(targetSessionsCompleted + 1, safeDailyTarget);
  const remainingAfterSave = Math.max(safeDailyTarget - nextSavedCount, 0);
  const afterSaveLabel = `${nextSavedCount}/${safeDailyTarget} today`;
  const resumeAfterSaveLabel = `${nextSavedCount}/${safeDailyTarget}`;
  const currentProgressLabel = `${Math.min(targetSessionsCompleted, safeDailyTarget)}/${safeDailyTarget} saved`;
  const firstUnlockTitle = nextUnlockTitle ?? 'Job Interview';

  if (!hasCompletedFoundation) {
    return {
      eyebrow: 'After lesson',
      rows: [
        {
          label: 'Today',
          value: safeDailyTarget === 1 ? '1/1 after first save' : `1/${safeDailyTarget} after first save`,
        },
        {
          label: 'Path',
          value: `${firstUnlockTitle} unlocks`,
        },
        {
          label: 'Reward',
          value: 'Starts your streak and opens Progress',
        },
      ],
      title: `${firstUnlockTitle} unlocks`,
    };
  }

  if (firstWinTomorrowPreview && !hasResumeDraft) {
    return {
      eyebrow: firstWinTomorrowPreview.eyebrow,
      rows: [
        {
          label: 'Today',
          value: currentProgressLabel,
        },
        {
          label: 'Tomorrow',
          value: firstWinTomorrowPreview.title,
        },
        {
          label: 'Coach',
          value: 'Reuse today\'s correction',
        },
      ],
      title: firstWinTomorrowPreview.title,
    };
  }

  if (hasResumeDraft) {
    return {
      eyebrow: 'Saved draft',
      rows: [
        {
          label: 'Coach',
          value: resumeDraftCoachText ?? 'Finish the draft, then save XP.',
        },
        {
          label: 'Today',
          value: remainingAfterSave === 0
            ? `${resumeAfterSaveLabel} complete`
            : `${resumeAfterSaveLabel} after save`,
        },
        {
          label: 'Path',
          value: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : `${currentTitle} stays ready`,
        },
      ],
      title: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : 'Finish this answer first',
    };
  }

  if (isMissionComplete) {
    return {
      eyebrow: 'Unlocked now',
      rows: [
        {
          label: 'Today',
          value: `${safeDailyTarget}/${safeDailyTarget} complete`,
        },
        {
          label: 'Path',
          value: nextUnlockTitle ? `${nextUnlockTitle} is active` : `${currentTitle} is ready`,
        },
        {
          label: 'Reward',
          value: 'Bonus XP can stack',
        },
      ],
      title: nextUnlockTitle ? `Start ${nextUnlockTitle}` : 'Bonus XP is ready',
    };
  }

  if (remainingAfterSave === 0) {
    return {
      eyebrow: 'After save',
      rows: [
        {
          label: 'Today',
          value: `${afterSaveLabel} complete`,
        },
        {
          label: 'Path',
          value: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : 'Today closes',
        },
        {
          label: 'Reward',
          value: targetSessionsCompleted === 0
            ? 'Starts your streak and opens Progress'
            : 'Locks in today\'s practice',
        },
      ],
      title: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : 'Today closes',
    };
  }

  const remainingLabel = remainingAfterSave === 1
    ? '1 more later'
    : `${remainingAfterSave} more later`;

  return {
    eyebrow: 'After save',
    rows: [
      {
        label: 'Today',
        value: `${afterSaveLabel} after save`,
      },
      {
        label: 'Path',
        value: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : 'Path stays ready',
      },
      {
        label: 'Reward',
        value: targetSessionsCompleted === 0
          ? 'Starts your streak and opens Progress'
          : remainingLabel,
      },
    ],
    title: nextUnlockTitle ? `${nextUnlockTitle} unlocks` : `${afterSaveLabel} saved`,
  };
}
