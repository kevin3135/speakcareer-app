type WritingSupportInput = {
  hasStarterEditPlan?: boolean;
  isExpanded: boolean;
  isAnswerPlanOpen: boolean;
  phraseLabel: string;
  planLabel: string;
  quickStartPhrase?: string;
};

export type WritingSupportState = {
  helperText: string;
  quickStartLabel: string;
  quickStartText: string;
  summaryLabel: string;
  title: string;
  toggleAccessibilityLabel: string;
  toggleLabel: string;
};

export function createWritingSupportState({
  hasStarterEditPlan = false,
  isExpanded,
  isAnswerPlanOpen,
  phraseLabel,
  planLabel,
  quickStartPhrase,
}: WritingSupportInput): WritingSupportState {
  const hasQuickStartPhrase = Boolean(quickStartPhrase?.trim());
  const summaryLabel = hasStarterEditPlan && !isExpanded
    ? `Starter edit plan + ${planLabel}`
    : isExpanded || !hasQuickStartPhrase
    ? `${phraseLabel} + ${planLabel}`
    : `1 starter + ${planLabel}`;

  return {
    helperText:
      hasStarterEditPlan && !isExpanded
        ? 'Edit the loaded starter in the answer box first. Open this only if you need the Lesson 1 steps again.'
        : isExpanded || isAnswerPlanOpen
        ? 'Use only what helps, then write your own short answer.'
        : 'Use one short starter first. Open more support only if you get stuck.',
    quickStartLabel: 'Quick starter',
    quickStartText: hasQuickStartPhrase
      ? quickStartPhrase!.trim()
      : 'Start with your own strongest first sentence.',
    summaryLabel,
    title: 'Writing support',
    toggleAccessibilityLabel: isExpanded ? 'Hide writing support' : 'Show writing support',
    toggleLabel: isExpanded ? 'Hide' : 'More',
  };
}
