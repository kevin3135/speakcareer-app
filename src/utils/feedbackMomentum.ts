import type { FeedbackScoreSummary } from './feedbackScoreSummary';

export type FeedbackMomentumRecap = {
  coachLine: string;
  nextFocusLabel: string;
  nextFocusValue: string;
  strongestLabel: string;
  strongestValue: string;
};

type CreateFeedbackMomentumRecapInput = {
  improvements: string[];
  summary: FeedbackScoreSummary;
};

export function createFeedbackMomentumRecap({
  improvements,
  summary,
}: CreateFeedbackMomentumRecapInput): FeedbackMomentumRecap | null {
  if (!summary.strongestArea || !summary.nextFocusArea) {
    return null;
  }

  const nextMove = improvements.find((item) => item.trim().length > 0)?.trim()
    || `Improve ${summary.nextFocusArea.label.toLowerCase()} next.`;

  return {
    coachLine: `Keep ${createKeepPhrase(summary.strongestArea.label)}. ${nextMove}`,
    nextFocusLabel: 'Improve next',
    nextFocusValue: `${summary.nextFocusArea.label} ${summary.nextFocusArea.value}`,
    strongestLabel: 'Working well',
    strongestValue: `${summary.strongestArea.label} ${summary.strongestArea.value}`,
  };
}

function createKeepPhrase(label: string) {
  switch (label.toLowerCase()) {
    case 'clarity':
      return 'your message clear';
    case 'confidence':
      return 'your answer direct';
    case 'structure':
      return 'your structure';
    case 'vocabulary':
      return 'your wording professional';
    default:
      return `your ${label.toLowerCase()}`;
  }
}
