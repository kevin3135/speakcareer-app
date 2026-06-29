export type FoundationHandoffInput = {
  coachNote: string;
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
        detail: 'Track XP, streak and the next guided step.',
        title: 'Unlock Learn + Wins',
      },
    ],
    starterAnswer,
    starterLabel: 'Starter answer',
    title: nextQuestTitle,
  };
}
