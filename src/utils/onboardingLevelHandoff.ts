export type OnboardingLevelHandoff = {
  body: string;
  primaryStepLabel: string;
  primaryStepTitle: string;
  secondaryStepLabel: string;
  secondaryStepTitle: string;
  title: string;
};

export function createOnboardingLevelHandoff(
  firstLessonTitle: string,
  firstQuestTitle: string,
): OnboardingLevelHandoff {
  const nextQuestTitleShort = firstQuestTitle.replace(/^Quest \d+:\s*/, '');

  return {
    body: `Start with ${firstLessonTitle}, then use the same shape in ${nextQuestTitleShort}.`,
    primaryStepLabel: 'Lesson 1',
    primaryStepTitle: firstLessonTitle,
    secondaryStepLabel: 'Quest 1',
    secondaryStepTitle: nextQuestTitleShort,
    title: 'We start simple',
  };
}
