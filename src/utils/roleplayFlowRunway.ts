export type RoleplayFlowStage = 'answer' | 'review' | 'save';
export type RoleplayFlowStepState = 'current' | 'done' | 'upcoming';

export type RoleplayFlowRunwayStep = {
  id: RoleplayFlowStage;
  label: string;
  numberLabel: string;
  state: RoleplayFlowStepState;
};

export type RoleplayFlowRunway = {
  currentStepLabel: string;
  nextStepsLabel: string | null;
  progressLabel: string;
  progressPercent: number;
  steps: RoleplayFlowRunwayStep[];
};

const flowStepLabels: Record<RoleplayFlowStage, string> = {
  answer: 'Answer',
  review: 'Review',
  save: 'Save',
};

const flowStepOrder: RoleplayFlowStage[] = ['answer', 'review', 'save'];

export function createRoleplayFlowRunway(currentStage: RoleplayFlowStage): RoleplayFlowRunway {
  const currentIndex = Math.max(flowStepOrder.indexOf(currentStage), 0);
  const totalSteps = flowStepOrder.length;
  const nextSteps = flowStepOrder.slice(currentIndex + 1).map((step) => flowStepLabels[step]);

  return {
    currentStepLabel: `${flowStepLabels[flowStepOrder[currentIndex]]} now`,
    nextStepsLabel: nextSteps.length ? `Then ${nextSteps.join(' -> ')}` : null,
    progressLabel: `Step ${currentIndex + 1} of ${totalSteps}`,
    progressPercent: Math.round(((currentIndex + 1) / totalSteps) * 100),
    steps: flowStepOrder.map((step, index) => ({
      id: step,
      label: flowStepLabels[step],
      numberLabel: String(index + 1),
      state: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming',
    })),
  };
}
