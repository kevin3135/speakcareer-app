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
  commitmentNote: string;
  commitmentTitle: string;
  ctaLabel: string;
  coachNote: string;
  dailyTargetLabel: string;
  dailyTargetNote: string;
  levelLabel: string;
  nextQuestTitleShort: string;
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
  const nextQuestTitleShort = createShortQuestTitle(firstQuestTitle);

  return {
    commitmentNote: createCommitmentNote(dailyTarget, nextQuestTitleShort),
    commitmentTitle: `${firstLessonTitle} now. ${nextQuestTitleShort} next.`,
    ctaLabel: `Start ${levelLabel} path`,
    coachNote,
    dailyTargetLabel: createDailyTargetLabel(dailyTarget),
    dailyTargetNote: createDailyTargetNote(dailyTarget),
    levelLabel,
    nextQuestTitleShort,
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

function createShortQuestTitle(firstQuestTitle: string) {
  return firstQuestTitle.replace(/^Quest \d+:\s*/, '');
}

function createCommitmentNote(dailyTarget: DailyPracticeTarget, nextQuestTitleShort: string) {
  if (dailyTarget === 1) {
    return `Finish the lesson, then save your first ${nextQuestTitleShort} answer today.`;
  }

  if (dailyTarget === 2) {
    return `Finish the lesson, then aim for 2 saved roleplays today starting with ${nextQuestTitleShort}.`;
  }

  return `Finish the lesson, then push for 3 saved roleplays today starting with ${nextQuestTitleShort}.`;
}
