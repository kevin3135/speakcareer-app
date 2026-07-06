export type FoundationWarmupPanel = {
  body: string;
  coachCueLabel: string;
  coachCueMessage: string;
  editPlanLabel: string;
  editPlanSteps: [string, string, string];
  starterAnswer: string;
  starterLabel: string;
  title: string;
};

type FoundationWarmupPanelInput = {
  coachCueLabel: string;
  coachCueMessage: string;
  editPlanSteps: [string, string, string];
  note: string;
  starterAnswer: string;
};

export function createFoundationWarmupPanel({
  coachCueLabel,
  coachCueMessage,
  editPlanSteps,
  note,
  starterAnswer,
}: FoundationWarmupPanelInput): FoundationWarmupPanel {
  const hasCoachNote = note.trim().length > 0;

  return {
    body: hasCoachNote
      ? 'Your Lesson 1 starter is already loaded below. Change the task and result, then check.'
      : 'Your starter is already loaded below. Make it yours, then check.',
    coachCueLabel,
    coachCueMessage,
    editPlanLabel: 'Make it yours',
    editPlanSteps,
    starterAnswer,
    starterLabel: 'Loaded starter',
    title: 'Lesson 1 starter is ready',
  };
}
