export type FoundationStarterAction = {
  badgeLabel: string;
  body: string;
  ctaLabel: string;
  mode: 'cleared' | 'edited' | 'loaded';
  title: string;
  tone: 'accent' | 'secondary' | 'success';
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
      badgeLabel: 'Cleared',
      body: 'Reload the starter or write your own version from scratch before you check.',
      ctaLabel: 'Reload starter',
      mode: 'cleared',
      title: 'Starter was cleared',
      tone: 'accent',
    };
  }

  if (normalizedDraft === normalizedStarter) {
    return {
      badgeLabel: 'Loaded',
      body: 'Change the task and result in the answer box, then tap Check.',
      ctaLabel: 'Edit answer',
      mode: 'loaded',
      title: 'Starter is already in your answer',
      tone: 'secondary',
    };
  }

  return {
    badgeLabel: 'Edited',
    body: 'Good. Do one final clarity pass, then tap Check.',
    ctaLabel: 'Reload starter',
    mode: 'edited',
    title: 'This answer already sounds more like you',
    tone: 'success',
  };
}

function normalizeAnswer(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
