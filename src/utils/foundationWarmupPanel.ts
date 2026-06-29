export type FoundationWarmupPanel = {
  body: string;
  coachLabel: string;
  editPlanLabel: string;
  editPlanSteps: [string, string, string];
  starterAnswer: string;
  starterLabel: string;
  title: string;
};

type FoundationWarmupPanelInput = {
  editPlanSteps: [string, string, string];
  note: string;
  starterAnswer: string;
};

export function createFoundationWarmupPanel({
  editPlanSteps,
  note,
  starterAnswer,
}: FoundationWarmupPanelInput): FoundationWarmupPanel {
  const hasCoachNote = note.trim().length > 0;

  return {
    body: hasCoachNote
      ? 'Make it yours, then check.'
      : 'Use this line, then check.',
    coachLabel: 'Coach note',
    editPlanLabel: 'Make it yours',
    editPlanSteps,
    starterAnswer,
    starterLabel: 'Loaded starter',
    title: 'Lesson 1 starter is ready',
  };
}
