import { FeedbackCard } from './ui';
import type { AIFeedback } from '../types';

type FeedbackPanelProps = {
  feedback: AIFeedback;
};

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <FeedbackCard
      correctedVersion={feedback.suggestedRewrite}
      explanation="This version is clearer because it uses a specific action, professional tone and a visible result."
      onRetry={() => undefined}
      onSaveMistake={() => undefined}
      scores={feedback.scores}
      strongerVersion={feedback.suggestedRewrite}
      summary={feedback.summary}
      toImprove={feedback.improvements}
      wentWell={feedback.strengths}
    />
  );
}
