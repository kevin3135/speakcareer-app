type WritingSupportInput = {
  isAnswerPlanOpen: boolean;
  isPhraseHelperOpen: boolean;
  phraseLabel: string;
  planLabel: string;
};

export type WritingSupportState = {
  helperText: string;
  summaryLabel: string;
  title: string;
};

export function createWritingSupportState({
  isAnswerPlanOpen,
  isPhraseHelperOpen,
  phraseLabel,
  planLabel,
}: WritingSupportInput): WritingSupportState {
  return {
    helperText:
      isAnswerPlanOpen || isPhraseHelperOpen
        ? 'Use only what helps, then write your own short answer.'
        : 'Open plan or phrases only if you get stuck.',
    summaryLabel: `${planLabel} + ${phraseLabel}`,
    title: 'Writing support',
  };
}
