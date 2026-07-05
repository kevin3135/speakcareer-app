import type { DailyPracticeTarget, StartingLevelId } from '../types';

type DailyTargetGuideConfig = {
  recommendationBody: string;
  recommendedTarget: DailyPracticeTarget;
};

type DailyTargetPreviewStat = {
  label: string;
  value: string;
};

export type OnboardingDailyTargetGuide = {
  previewBody: string;
  previewStats: [DailyTargetPreviewStat, DailyTargetPreviewStat];
  recommendationBody: string;
  recommendationLabel: string;
  recommendationTitle: string;
  recommendedTarget: DailyPracticeTarget;
  selectionBody: string;
  selectionLabel: string;
  selectionTone: 'accent' | 'info' | 'success';
};

const DAILY_TARGET_GUIDE_CONFIG: Record<StartingLevelId, DailyTargetGuideConfig> = {
  starter: {
    recommendationBody: 'Build a repeatable habit before adding more reps.',
    recommendedTarget: 1,
  },
  basic: {
    recommendationBody: 'Two short reps build confidence without a heavy routine.',
    recommendedTarget: 2,
  },
  confident: {
    recommendationBody: 'Three short reps make week one real interview practice.',
    recommendedTarget: 3,
  },
};

export function createOnboardingDailyTargetGuide(
  startingLevelId: StartingLevelId,
  selectedTarget: DailyPracticeTarget,
): OnboardingDailyTargetGuide {
  const config = DAILY_TARGET_GUIDE_CONFIG[startingLevelId];
  const previewStats = createPreviewStats(selectedTarget);
  const recommendationLabel = `${config.recommendedTarget}/day`;
  const recommendationTitle = `Recommended start: ${formatDailyTarget(config.recommendedTarget)}`;

  if (selectedTarget === config.recommendedTarget) {
    return {
      previewBody: createPreviewBody(selectedTarget),
      previewStats,
      recommendationBody: config.recommendationBody,
      recommendationLabel,
      recommendationTitle,
      recommendedTarget: config.recommendedTarget,
      selectionBody: 'Best fit for your level.',
      selectionLabel: 'Best fit',
      selectionTone: 'success',
    };
  }

  if (selectedTarget < config.recommendedTarget) {
    return {
      previewBody: createPreviewBody(selectedTarget),
      previewStats,
      recommendationBody: config.recommendationBody,
      recommendationLabel,
      recommendationTitle,
      recommendedTarget: config.recommendedTarget,
      selectionBody: 'Lighter pace: consistency first.',
      selectionLabel: 'Lighter start',
      selectionTone: 'info',
    };
  }

  return {
    previewBody: createPreviewBody(selectedTarget),
    previewStats,
    recommendationBody: config.recommendationBody,
    recommendationLabel,
    recommendationTitle,
    recommendedTarget: config.recommendedTarget,
    selectionBody: 'Faster push: extra short reps today.',
    selectionLabel: 'Faster push',
    selectionTone: 'accent',
  };
}

function formatDailyTarget(dailyTarget: DailyPracticeTarget) {
  return `${dailyTarget} ${dailyTarget === 1 ? 'roleplay' : 'roleplays'} a day`;
}

function createPreviewStats(
  dailyTarget: DailyPracticeTarget,
): [DailyTargetPreviewStat, DailyTargetPreviewStat] {
  return [
    {
      label: 'First week',
      value: `${dailyTarget * 7} reps`,
    },
    {
      label: 'Daily time',
      value: `${dailyTarget * 5} min`,
    },
  ];
}

function createPreviewBody(dailyTarget: DailyPracticeTarget) {
  if (dailyTarget === 1) {
    return 'Protect a calm daily streak while answer shape becomes automatic.';
  }

  if (dailyTarget === 2) {
    return 'Balanced practice: real reps without a heavy routine.';
  }

  return 'A stronger sprint for extra interview repetition this week.';
}
