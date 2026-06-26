export type RoleplayGuideStatus = 'active' | 'done' | 'locked';

export type RoleplayGuideStepId = 'read' | 'answer' | 'review' | 'save';

export type RoleplayGuideStep = {
  helper: string;
  id: RoleplayGuideStepId;
  status: RoleplayGuideStatus;
  title: string;
};

export type RoleplayGuideState = {
  activeInstruction: string;
  activeLabel: string;
  steps: RoleplayGuideStep[];
};

type RoleplayGuideInput = {
  hasDraftAnswer: boolean;
  hasReviewedAnswer: boolean;
  isReadyForFeedback: boolean;
  isSaved: boolean;
};

const baseSteps: Omit<RoleplayGuideStep, 'status'>[] = [
  {
    helper: 'Read the AI question and useful phrases.',
    id: 'read',
    title: 'Read',
  },
  {
    helper: 'Write one short spoken answer.',
    id: 'answer',
    title: 'Answer',
  },
  {
    helper: 'Tap review to see feedback.',
    id: 'review',
    title: 'Review',
  },
  {
    helper: 'Save the session for progress.',
    id: 'save',
    title: 'Save',
  },
];

export function createRoleplayGuideState(input: RoleplayGuideInput): RoleplayGuideState {
  const activeStepId = getActiveStepId(input);

  return {
    activeInstruction: getActiveInstruction(input),
    activeLabel: getActiveLabel(input),
    steps: baseSteps.map((step) => ({
      ...step,
      status: getStepStatus(step.id, activeStepId, input),
    })),
  };
}

function getActiveStepId(input: RoleplayGuideInput): RoleplayGuideStepId | null {
  if (input.isSaved) {
    return null;
  }

  if (input.isReadyForFeedback) {
    return 'save';
  }

  if (input.hasReviewedAnswer) {
    return 'answer';
  }

  if (input.hasDraftAnswer) {
    return 'review';
  }

  return 'read';
}

function getStepStatus(
  stepId: RoleplayGuideStepId,
  activeStepId: RoleplayGuideStepId | null,
  input: RoleplayGuideInput,
): RoleplayGuideStatus {
  if (input.isSaved) {
    return 'done';
  }

  if (stepId === activeStepId) {
    return 'active';
  }

  if (stepId === 'read' && activeStepId !== 'read') {
    return 'done';
  }

  if (stepId === 'answer' && (activeStepId === 'review' || activeStepId === 'save')) {
    return 'done';
  }

  if (stepId === 'review' && activeStepId === 'save') {
    return 'done';
  }

  return 'locked';
}

function getActiveLabel(input: RoleplayGuideInput) {
  if (input.isSaved) {
    return 'Session saved';
  }

  if (input.isReadyForFeedback) {
    return 'Step 4 of 4';
  }

  if (input.hasDraftAnswer && !input.hasReviewedAnswer) {
    return 'Step 3 of 4';
  }

  if (input.hasReviewedAnswer) {
    return 'Step 2 of 4';
  }

  return 'Step 1 of 4';
}

function getActiveInstruction(input: RoleplayGuideInput) {
  if (input.isSaved) {
    return 'Saved to Progress. Review your progress or start another roleplay when ready.';
  }

  if (input.isReadyForFeedback) {
    return 'Your feedback is ready. Check it, answer the follow-up if you want, then save.';
  }

  if (input.hasDraftAnswer && !input.hasReviewedAnswer) {
    return 'You have a draft. Tap Review answer when it feels ready.';
  }

  if (input.hasReviewedAnswer) {
    return 'Add one result, detail or next step, then review again.';
  }

  return 'Read the prompt first. Then write one short answer in natural work English.';
}
