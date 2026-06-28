import type { DailyPracticeTarget } from '../types';

type OnboardingPlanStep = {
  detail: string;
  label: string;
  title: string;
};

export type OnboardingPlanPreviewInput = {
  coachNote: string;
  dailyTarget: DailyPracticeTarget;
  firstLessonDetail: string;
  firstLessonTitle: string;
  firstQuestSubtitle: string;
  firstQuestTitle: string;
  levelLabel: string;
  starterPrompt: string;
};

export type OnboardingPlanPreview = {
  coachNote: string;
  dailyTargetLabel: string;
  dailyTargetNote: string;
  levelLabel: string;
  starterPrompt: string;
  steps: [OnboardingPlanStep, OnboardingPlanStep];
  title: string;
};

export function createOnboardingPlanPreview({
  coachNote,
  dailyTarget,
  firstLessonDetail,
  firstLessonTitle,
  firstQuestSubtitle,
  firstQuestTitle,
  levelLabel,
  starterPrompt,
}: OnboardingPlanPreviewInput): OnboardingPlanPreview {
  return {
    coachNote,
    dailyTargetLabel: createDailyTargetLabel(dailyTarget),
    dailyTargetNote: createDailyTargetNote(dailyTarget),
    levelLabel,
    starterPrompt,
    steps: [
      {
        detail: firstLessonDetail,
        label: 'Lesson 1',
        title: firstLessonTitle,
      },
      {
        detail: firstQuestSubtitle,
        label: 'Quest 1',
        title: firstQuestTitle,
      },
    ],
    title: 'Your first English path',
  };
}

function createDailyTargetLabel(dailyTarget: DailyPracticeTarget) {
  return `${dailyTarget} ${dailyTarget === 1 ? 'roleplay' : 'roleplays'} a day`;
}

function createDailyTargetNote(dailyTarget: DailyPracticeTarget) {
  if (dailyTarget === 1) {
    return 'Light start. Best for a steady five-minute work-English habit.';
  }

  if (dailyTarget === 2) {
    return 'Balanced pace. Enough repetition to build confidence faster.';
  }

  return 'Focused push. Best when you want extra interview reps today.';
}
