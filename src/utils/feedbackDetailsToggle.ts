type FeedbackDetailsToggleState = {
  badgeLabel: string;
  meta: string;
  title: string;
  tone: 'accent' | 'info';
};

type CreateFeedbackDetailsToggleStateParams = {
  improvementCount: number;
  isOpen: boolean;
  scoreCount: number;
  strengthCount: number;
};

export function createFeedbackDetailsToggleState({
  improvementCount,
  isOpen,
  scoreCount,
  strengthCount,
}: CreateFeedbackDetailsToggleStateParams): FeedbackDetailsToggleState {
  const safeScoreCount = Math.max(0, scoreCount);
  const safeNoteCount = Math.max(0, improvementCount) + Math.max(0, strengthCount);

  if (isOpen) {
    return {
      badgeLabel: 'Open',
      meta: 'Main correction stays above.',
      title: 'Hide deeper notes',
      tone: 'info',
    };
  }

  const scoreLabel = safeScoreCount === 1 ? '1 score bar' : `${safeScoreCount} score bars`;
  const noteLabel = safeNoteCount === 1 ? '1 coach note' : `${safeNoteCount} coach notes`;

  return {
    badgeLabel: 'Later',
    meta: `${scoreLabel} and ${noteLabel}.`,
    title: 'Why this works',
    tone: 'accent',
  };
}
