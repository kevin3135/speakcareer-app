export type FoundationStarterAction = {
  ctaLabel: string;
  mode: 'cleared' | 'edited' | 'loaded';
};

type CreateFoundationStarterActionInput = {
  draftAnswer: string;
  starterAnswer: string;
};

export function createFoundationStarterAction({
  draftAnswer,
  starterAnswer,
}: CreateFoundationStarterActionInput): FoundationStarterAction {
  const normalizedDraft = normalizeAnswer(draftAnswer);
  const normalizedStarter = normalizeAnswer(starterAnswer);

  if (!normalizedDraft) {
    return {
      ctaLabel: 'Reload starter',
      mode: 'cleared',
    };
  }

  if (normalizedDraft === normalizedStarter) {
    return {
      ctaLabel: 'Edit answer',
      mode: 'loaded',
    };
  }

  return {
    ctaLabel: 'Reload starter',
    mode: 'edited',
  };
}

function normalizeAnswer(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
