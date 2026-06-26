type WritingSupportInput = {
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
  isExpanded,
  isAnswerPlanOpen,
  phraseLabel,
  planLabel,
  quickStartPhrase,
}: WritingSupportInput): WritingSupportState {
  const hasQuickStartPhrase = Boolean(quickStartPhrase?.trim());

  return {
    helperText:
      isExpanded || isAnswerPlanOpen
        ? 'Use only what helps, then write your own short answer.'
        : 'Use one short starter first. Open more support only if you get stuck.',
    quickStartLabel: 'Quick starter',
    quickStartText: hasQuickStartPhrase
      ? quickStartPhrase!.trim()
      : 'Start with your own strongest first sentence.',
    summaryLabel: isExpanded
      ? `${phraseLabel} + ${planLabel}`
      : `1 starter + ${planLabel}`,
    title: 'Writing support',
    toggleAccessibilityLabel: isExpanded ? 'Hide writing support' : 'Show writing support',
    toggleLabel: isExpanded ? 'Hide' : 'More',
  };
}
