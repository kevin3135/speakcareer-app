import type { DailyPracticeTarget } from '../types';

export type FoundationHandoffInput = {
  coachNote: string;
  dailyTarget: DailyPracticeTarget;
  nextQuestTitle: string;
  starterAnswer: string;
  starterEditSteps: [string, string, string];
};

export type FoundationHandoff = {
  body: string;
  coachNote: string;
  editPlanLabel: string;
  editPlanSteps: [string, string, string];
  eyebrow: string;
  pathLabel: string;
  pathSteps: {
    badgeLabel: string;
    detail: string;
    title: string;
  }[];
  starterAnswer: string;
  starterLabel: string;
  title: string;
};

export function createFoundationHandoff({
  coachNote,
  dailyTarget,
  nextQuestTitle,
  starterAnswer,
  starterEditSteps,
}: FoundationHandoffInput): FoundationHandoff {
  const nextQuestTitleShort = nextQuestTitle.includes(': ')
    ? nextQuestTitle.split(': ').slice(1).join(': ')
    : nextQuestTitle;

  return {
    body: 'Use the same clear shape in your first interview answer.',
    coachNote,
    editPlanLabel: 'Make it yours',
    editPlanSteps: starterEditSteps,
    eyebrow: 'Next step',
    pathLabel: 'What happens next',
    pathSteps: [
      {
        badgeLabel: 'Now',
        detail: 'Your starter line is ready.',
        title: `Open ${nextQuestTitleShort}`,
      },
      {
        badgeLabel: 'After save',
        detail: createFirstSavePathDetail(dailyTarget),
        title: 'Unlock Wins',
      },
    ],
    starterAnswer,
    starterLabel: 'Starter answer',
    title: nextQuestTitle,
  };
}

function createFirstSavePathDetail(dailyTarget: DailyPracticeTarget) {
  if (dailyTarget === 1) {
    return 'Start your streak and complete 1/1 today.';
  }

  return `Start your streak and reach 1/${dailyTarget} today.`;
}
