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
    recommendationBody:
      'Keep day one light so the English answer shape becomes a repeatable habit first.',
    recommendedTarget: 1,
  },
  basic: {
    recommendationBody:
      'Two short reps give you enough repetition to build confidence without making the routine heavy.',
    recommendedTarget: 2,
  },
  confident: {
    recommendationBody:
      'Three short reps turn the first week into real interview practice, not only a warm-up.',
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
      selectionBody: 'This matches the recommended pace for your current English level.',
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
      selectionBody: 'A lighter pace is still fine if consistency matters more than speed this week.',
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
    selectionBody: 'This is a faster push. Keep it only if you want extra short reps today.',
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
    return 'Best for protecting a calm daily streak while you build answer structure.';
  }

  if (dailyTarget === 2) {
    return 'Balanced enough to feel like real practice without making the routine heavy.';
  }

  return 'A stronger sprint for faster interview repetition if you want extra momentum this week.';
}
