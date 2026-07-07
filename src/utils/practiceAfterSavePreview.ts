import type { PracticeTargetPreview } from './practiceCompletion';
import type { PracticeLevelPayoffState } from './practiceLevelPayoff';
import type { PracticeRecommendedPayoffState } from './practiceLibraryState';

export type PracticeAfterSavePreviewState = {
  badgeLabel: string;
  eyebrow: string;
  rows: {
    label: string;
    value: string;
  }[];
  title: string;
};

type CreatePracticeAfterSavePreviewInput = {
  isResumeMode: boolean;
  levelPayoff: PracticeLevelPayoffState;
  recommendedPayoff: PracticeRecommendedPayoffState;
  targetPreview: PracticeTargetPreview;
};

export function createPracticeAfterSavePreview({
  isResumeMode,
  levelPayoff,
  recommendedPayoff,
  targetPreview,
}: CreatePracticeAfterSavePreviewInput): PracticeAfterSavePreviewState {
  return {
    badgeLabel: levelPayoff.badgeLabel,
    eyebrow: 'After this save',
    rows: [
      {
        label: 'Today',
        value: createTodayValue(targetPreview),
      },
      {
        label: 'Path',
        value: createPathValue({ isResumeMode, recommendedPayoff }),
      },
      {
        label: 'Level',
        value: createLevelValue(levelPayoff),
      },
    ],
    title: createTitle({ isResumeMode, levelPayoff, recommendedPayoff, targetPreview }),
  };
}

function createTodayValue(targetPreview: PracticeTargetPreview) {
  if (targetPreview.badgeLabel === 'Bonus practice') {
    return 'Daily target stays complete';
  }

  return targetPreview.progressLabel.replace(/^After save:\s*/i, '');
}

function createPathValue({
  isResumeMode,
  recommendedPayoff,
}: {
  isResumeMode: boolean;
  recommendedPayoff: PracticeRecommendedPayoffState;
}) {
  if (isResumeMode) {
    return 'Guided path active again';
  }

  if (recommendedPayoff.eyebrow === 'Next unlock') {
    return recommendedPayoff.title;
  }

  if (recommendedPayoff.badgeLabel === 'Path ready') {
    return 'Full path stays available';
  }

  return 'Guided path keeps moving';
}

function createLevelValue(levelPayoff: PracticeLevelPayoffState) {
  if (/ unlocked$/i.test(levelPayoff.progressLabel)) {
    return levelPayoff.progressLabel;
  }

  return `${levelPayoff.afterSaveProgressLabel} on ${levelPayoff.afterSaveLevelLabel}`;
}

function createTitle({
  isResumeMode,
  levelPayoff,
  recommendedPayoff,
  targetPreview,
}: CreatePracticeAfterSavePreviewInput) {
  if (!isResumeMode && recommendedPayoff.eyebrow === 'Next unlock') {
    return recommendedPayoff.title;
  }

  if (/ unlocked$/i.test(levelPayoff.progressLabel)) {
    return levelPayoff.title;
  }

  if (targetPreview.badgeLabel === 'Bonus practice') {
    return 'Extra XP after this save';
  }

  return targetPreview.title;
}
