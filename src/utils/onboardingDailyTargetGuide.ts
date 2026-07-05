import type { DailyPracticeTarget, StartingLevelId } from '../types';

type DailyTargetGuideConfig = {
  recommendationBody: string;
  recommendedTarget: DailyPracticeTarget;
};

export type OnboardingDailyTargetGuide = {
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
  const recommendationLabel = `${config.recommendedTarget}/day`;
  const recommendationTitle = `Recommended start: ${formatDailyTarget(config.recommendedTarget)}`;

  if (selectedTarget === config.recommendedTarget) {
    return {
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
