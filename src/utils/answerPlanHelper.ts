type AnswerPlanHelperInput = {
  isOpen: boolean;
  steps: string[];
};

export type AnswerPlanHelperState = {
  helperText: string;
  stepCountLabel: string;
  steps: string[];
  title: string;
  toggleAccessibilityLabel: string;
  toggleLabel: string;
};

export function createAnswerPlanHelperState({
  isOpen,
  steps,
}: AnswerPlanHelperInput): AnswerPlanHelperState {
  const safeSteps = steps.filter((step) => step.trim().length > 0);
  const stepCountLabel = `${safeSteps.length}-step plan`;

  return {
    helperText: isOpen
      ? 'Use these steps if you want structure before writing.'
      : 'Open only if you want structure before writing.',
    stepCountLabel,
    steps: isOpen ? safeSteps : [],
    title: 'Answer plan',
    toggleAccessibilityLabel: isOpen ? 'Hide answer plan' : 'Show answer plan',
    toggleLabel: isOpen ? 'Hide' : 'Show',
  };
}
