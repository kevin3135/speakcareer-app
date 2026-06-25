export type AnswerReview = {
  wordCount: number;
  readinessLabel: string;
  reviewNote: string;
  isReadyForFeedback: boolean;
};

export function summarizePracticeAnswer(answer: string): AnswerReview {
  const words = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      wordCount,
      readinessLabel: 'No answer yet',
      reviewNote: 'Write a first response before reviewing feedback.',
      isReadyForFeedback: false,
    };
  }

  if (wordCount < 12) {
    return {
      wordCount,
      readinessLabel: 'Needs more detail',
      reviewNote: 'Add one concrete action or example from work.',
      isReadyForFeedback: false,
    };
  }

  if (wordCount < 35) {
    return {
      wordCount,
      readinessLabel: 'Good start',
      reviewNote: 'Add a result, decision or next step to make the answer stronger.',
      isReadyForFeedback: true,
    };
  }

  return {
    wordCount,
    readinessLabel: 'Ready for feedback',
    reviewNote: 'Strong length for a short professional answer. Now review clarity and structure.',
    isReadyForFeedback: true,
  };
}
