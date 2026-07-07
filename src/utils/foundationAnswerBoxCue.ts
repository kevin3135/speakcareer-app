export type FoundationAnswerBoxCue = {
  badgeLabel: string;
  body: string;
  title: string;
  tone: 'accent' | 'secondary' | 'success';
};

type CreateFoundationAnswerBoxCueInput = {
  draftAnswer: string;
  isReadyForFeedback: boolean;
  steps: [string, string, string];
  starterAnswer: string;
};

export function createFoundationAnswerBoxCue({
  draftAnswer,
  isReadyForFeedback,
  steps,
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
      badgeLabel: 'Step 2 of 3',
      body: 'Make this one change in the answer box before you check.',
      title: steps[1],
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
    badgeLabel: 'Step 3 of 3',
    body: 'Add this final line in the answer box before you check.',
    title: steps[2],
    tone: 'accent',
  };
}

function normalizeAnswer(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
