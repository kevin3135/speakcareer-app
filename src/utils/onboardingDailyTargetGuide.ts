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
  habitBody: string;
  habitTitle: string;
  nextActionBody: string;
  nextActionLabel: string;
  nextActionTitle: string;
  previewBody: string;
  previewStats: [DailyTargetPreviewStat, DailyTargetPreviewStat];
  recommendationBody: string;
  recommendationLabel: string;
  recommendationTitle: string;
  recommendedTarget: DailyPracticeTarget;
  selectedTargetLabel: string;
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
  const habitPreview = createHabitPreview(selectedTarget);
  const nextAction = createNextAction(selectedTarget);
  const previewStats = createPreviewStats(selectedTarget);
  const recommendationLabel = `${config.recommendedTarget}/day`;
  const recommendationTitle = `Start with ${recommendationLabel}`;
  const selectedTargetLabel = `${selectedTarget}/day`;

  if (selectedTarget === config.recommendedTarget) {
    return {
      habitBody: habitPreview.body,
      habitTitle: habitPreview.title,
      nextActionBody: nextAction.body,
      nextActionLabel: nextAction.label,
      nextActionTitle: nextAction.title,
      previewBody: createPreviewBody(selectedTarget),
      previewStats,
      recommendationBody: config.recommendationBody,
      recommendationLabel,
      recommendationTitle,
      recommendedTarget: config.recommendedTarget,
      selectedTargetLabel,
      selectionBody: 'Best fit for your level.',
      selectionLabel: 'Best fit',
      selectionTone: 'success',
    };
  }

  if (selectedTarget < config.recommendedTarget) {
    return {
      habitBody: habitPreview.body,
      habitTitle: habitPreview.title,
      nextActionBody: nextAction.body,
      nextActionLabel: nextAction.label,
      nextActionTitle: nextAction.title,
      previewBody: createPreviewBody(selectedTarget),
      previewStats,
      recommendationBody: config.recommendationBody,
      recommendationLabel,
      recommendationTitle,
      recommendedTarget: config.recommendedTarget,
      selectedTargetLabel,
      selectionBody: 'Lighter pace: consistency first.',
      selectionLabel: 'Lighter start',
      selectionTone: 'info',
    };
  }

  return {
    habitBody: habitPreview.body,
    habitTitle: habitPreview.title,
    nextActionBody: nextAction.body,
    nextActionLabel: nextAction.label,
    nextActionTitle: nextAction.title,
    previewBody: createPreviewBody(selectedTarget),
    previewStats,
    recommendationBody: config.recommendationBody,
    recommendationLabel,
    recommendationTitle,
    recommendedTarget: config.recommendedTarget,
    selectedTargetLabel,
    selectionBody: 'Faster push: extra short reps today.',
    selectionLabel: 'Faster push',
    selectionTone: 'accent',
  };
}

export function getRecommendedOnboardingDailyTarget(
  startingLevelId: StartingLevelId,
): DailyPracticeTarget {
  return DAILY_TARGET_GUIDE_CONFIG[startingLevelId].recommendedTarget;
}

export function resolveOnboardingDailyTarget(
  startingLevelId: StartingLevelId,
  selectedTarget: DailyPracticeTarget,
  hasManualSelection: boolean,
): DailyPracticeTarget {
  if (hasManualSelection) {
    return selectedTarget;
  }

  return getRecommendedOnboardingDailyTarget(startingLevelId);
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

function createHabitPreview(dailyTarget: DailyPracticeTarget) {
  if (dailyTarget === 1) {
    return {
      body: "First save starts your streak and completes today's target.",
      title: 'One save closes Day 1',
    };
  }

  if (dailyTarget === 2) {
    return {
      body: 'First save starts your streak. One more short rep closes today.',
      title: 'Save once now, once later',
    };
  }

  return {
    body: 'First save starts your streak. Two more short reps close today.',
    title: 'Start with one, finish with two more',
  };
}

function createNextAction(dailyTarget: DailyPracticeTarget) {
  if (dailyTarget === 1) {
    return {
      body: 'Continue opens Lesson 1, then one Job Interview save closes today.',
      label: 'Start next',
      title: 'One focused answer',
    };
  }

  if (dailyTarget === 2) {
    return {
      body: 'Continue opens Lesson 1, then save Job Interview and one short follow-up.',
      label: 'Start next',
      title: 'First save, then one more',
    };
  }

  return {
    body: 'Continue opens Lesson 1, then save Job Interview and two short reps.',
    label: 'Start next',
    title: 'One strong start, two extra reps',
  };
}
