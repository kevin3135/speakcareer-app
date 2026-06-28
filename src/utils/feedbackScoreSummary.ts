import type { FeedbackScore } from '../types';

export type FeedbackScoreSummary = {
  overallScore: number;
  strongestArea: FeedbackScore | null;
  nextFocusArea: FeedbackScore | null;
};

export function createFeedbackScoreSummary(scores: FeedbackScore[]): FeedbackScoreSummary {
  const normalizedScores = scores.map((score) => ({
    label: score.label,
    value: clampScore(score.value),
  }));

  if (normalizedScores.length === 0) {
    return {
      nextFocusArea: null,
      overallScore: 0,
      strongestArea: null,
    };
  }

  const overallScore = Math.round(
    normalizedScores.reduce((total, score) => total + score.value, 0) / normalizedScores.length,
  );

  let strongestArea = normalizedScores[0];
  let nextFocusArea = normalizedScores[0];

  for (const score of normalizedScores.slice(1)) {
    if (score.value > strongestArea.value) {
      strongestArea = score;
    }

    if (score.value < nextFocusArea.value) {
      nextFocusArea = score;
    }
  }

  return {
    nextFocusArea,
    overallScore,
    strongestArea,
  };
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
