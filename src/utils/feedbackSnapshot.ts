import type { FeedbackScoreSummary } from './feedbackScoreSummary';

export type FeedbackSnapshot = {
  answerPreview: string;
  nextFocusLabel: string;
  nextMoveText: string;
  strongestLabel: string;
};

type CreateFeedbackSnapshotInput = {
  answer: string;
  improvements: string[];
  summary: FeedbackScoreSummary;
};

const ANSWER_PREVIEW_LIMIT = 140;

export function createFeedbackSnapshot({
  answer,
  improvements,
  summary,
}: CreateFeedbackSnapshotInput): FeedbackSnapshot | null {
  if (!summary.strongestArea || !summary.nextFocusArea) {
    return null;
  }

  const normalizedAnswer = answer.trim().replace(/\s+/g, ' ');
  const answerPreview = normalizedAnswer.length > ANSWER_PREVIEW_LIMIT
    ? `${normalizedAnswer.slice(0, ANSWER_PREVIEW_LIMIT - 3).trimEnd()}...`
    : normalizedAnswer;
  const nextMove = improvements.find((item) => item.trim().length > 0);

  return {
    answerPreview,
    nextFocusLabel: `${summary.nextFocusArea.label} ${summary.nextFocusArea.value}`,
    nextMoveText: nextMove
      ? nextMove
      : `Keep improving ${summary.nextFocusArea.label.toLowerCase()}.`,
    strongestLabel: `${summary.strongestArea.label} ${summary.strongestArea.value}`,
  };
}
