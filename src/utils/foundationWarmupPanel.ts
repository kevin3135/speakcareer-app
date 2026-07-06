export type FoundationWarmupPanel = {
  body: string;
  coachCueLabel: string;
  coachCueMessage: string;
  editPlanLabel: string;
  editPlanSteps: [string, string, string];
  starterAnswer: string;
  starterLabel: string;
  title: string;
  unlockProgress: {
    body: string;
    progressLabel: string;
    unlockLabel: string;
  } | null;
};

type FoundationWarmupPanelInput = {
  coachCueLabel: string;
  coachCueMessage: string;
  editPlanSteps: [string, string, string];
  note: string;
  starterAnswer: string;
  unlockProgress?: {
    progressLabel: string;
    unlockLabel: string;
  } | null;
};

export function createFoundationWarmupPanel({
  coachCueLabel,
  coachCueMessage,
  editPlanSteps,
  note,
  starterAnswer,
  unlockProgress,
}: FoundationWarmupPanelInput): FoundationWarmupPanel {
  const hasCoachNote = note.trim().length > 0;
  const unlockBody = unlockProgress
    ? createUnlockProgressBody(unlockProgress.unlockLabel)
    : null;

  return {
    body: hasCoachNote
      ? 'Lesson 1 starter is loaded. Edit the task and result, then check.'
      : 'Starter is loaded. Make it yours, then check.',
    coachCueLabel,
    coachCueMessage,
    editPlanLabel: 'Make it yours',
    editPlanSteps,
    starterAnswer,
    starterLabel: 'Loaded starter',
    title: 'Lesson 1 starter is ready',
    unlockProgress: unlockProgress && unlockBody
      ? {
        body: unlockBody,
        progressLabel: unlockProgress.progressLabel,
        unlockLabel: unlockProgress.unlockLabel,
      }
      : null,
  };
}

function createUnlockProgressBody(unlockLabel: string) {
  const unlockAction = unlockLabel.replace(/^Unlock\s+/i, 'unlock ');

  return `Save this edited answer to ${unlockAction}.`;
}
