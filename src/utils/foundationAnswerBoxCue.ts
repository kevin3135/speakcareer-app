export type FoundationAnswerBoxCue = {
  badgeLabel: string;
  body: string;
  title: string;
  tone: 'accent' | 'secondary' | 'success';
};

type CreateFoundationAnswerBoxCueInput = {
  draftAnswer: string;
  isReadyForFeedback: boolean;
  starterAnswer: string;
};

export function createFoundationAnswerBoxCue({
  draftAnswer,
  isReadyForFeedback,
  starterAnswer,
}: CreateFoundationAnswerBoxCueInput): FoundationAnswerBoxCue {
  const normalizedDraft = normalizeAnswer(draftAnswer);
  const normalizedStarter = normalizeAnswer(starterAnswer);

  if (!normalizedDraft) {
    return {
      badgeLabel: 'Write now',
      body: 'Reload the starter or write your own version below before you check.',
      title: 'Answer box is empty',
      tone: 'accent',
    };
  }

  if (normalizedDraft === normalizedStarter) {
    return {
      badgeLabel: 'Edit first',
      body: 'Replace the task and result with your own work example in the answer box.',
      title: 'Edit the loaded starter below',
      tone: 'secondary',
    };
  }

  if (isReadyForFeedback) {
    return {
      badgeLabel: 'Ready to check',
      body: 'Your answer already sounds personal. Do one quick clarity pass, then check it.',
      title: 'Your edit is ready for feedback',
      tone: 'success',
    };
  }

  return {
    badgeLabel: 'Add detail',
    body: 'Keep editing below. Add one clearer result or next step before you check.',
    title: 'Your answer is moving in the right direction',
    tone: 'accent',
  };
}

function normalizeAnswer(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
