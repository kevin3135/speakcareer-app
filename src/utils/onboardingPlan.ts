type OnboardingPlanStep = {
  detail: string;
  label: string;
  title: string;
};

export type OnboardingPlanPreviewInput = {
  coachNote: string;
  firstLessonDetail: string;
  firstLessonTitle: string;
  firstQuestSubtitle: string;
  firstQuestTitle: string;
  levelLabel: string;
  starterPrompt: string;
};

export type OnboardingPlanPreview = {
  coachNote: string;
  levelLabel: string;
  starterPrompt: string;
  steps: [OnboardingPlanStep, OnboardingPlanStep];
  title: string;
};

export function createOnboardingPlanPreview({
  coachNote,
  firstLessonDetail,
  firstLessonTitle,
  firstQuestSubtitle,
  firstQuestTitle,
  levelLabel,
  starterPrompt,
}: OnboardingPlanPreviewInput): OnboardingPlanPreview {
  return {
    coachNote,
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
