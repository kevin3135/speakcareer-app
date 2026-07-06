export type FoundationStarterChecklistItem = {
  state: 'current' | 'done' | 'upcoming';
  statusLabel: 'Do now' | 'Done' | 'Next';
  text: string;
};

export type FoundationStarterChecklist = {
  items: FoundationStarterChecklistItem[];
  progressLabel: string;
};

type CreateFoundationStarterChecklistInput = {
  draftAnswer: string;
  isReadyForFeedback: boolean;
  starterAnswer: string;
  steps: [string, string, string];
};

export function createFoundationStarterChecklist({
  draftAnswer,
  isReadyForFeedback,
  starterAnswer,
  steps,
}: CreateFoundationStarterChecklistInput): FoundationStarterChecklist {
  const normalizedDraft = normalizeAnswer(draftAnswer);
  const normalizedStarter = normalizeAnswer(starterAnswer);
  const hasDraft = normalizedDraft.length > 0;
  const isEdited = hasDraft && normalizedDraft !== normalizedStarter;
  const isReady = isEdited && isReadyForFeedback;
  const completedCount = Number(hasDraft) + Number(isEdited) + Number(isReady);

  return {
    items: steps.map((text, index) => ({
      state: resolveChecklistState(index, hasDraft, isEdited, isReady),
      statusLabel: resolveChecklistStatusLabel(index, hasDraft, isEdited, isReady),
      text,
    })),
    progressLabel: completedCount === steps.length
      ? `${steps.length}/${steps.length} ready`
      : `Step ${completedCount + 1} of ${steps.length}`,
  };
}

function resolveChecklistState(
  index: number,
  hasDraft: boolean,
  isEdited: boolean,
  isReady: boolean,
): FoundationStarterChecklistItem['state'] {
  if (index === 0) {
    return hasDraft ? 'done' : 'current';
  }

  if (index === 1) {
    if (isEdited) {
      return 'done';
    }

    return hasDraft ? 'current' : 'upcoming';
  }

  if (isReady) {
    return 'done';
  }

  return isEdited ? 'current' : 'upcoming';
}

function resolveChecklistStatusLabel(
  index: number,
  hasDraft: boolean,
  isEdited: boolean,
  isReady: boolean,
): FoundationStarterChecklistItem['statusLabel'] {
  const state = resolveChecklistState(index, hasDraft, isEdited, isReady);

  if (state === 'done') {
    return 'Done';
  }

  if (state === 'current') {
    return 'Do now';
  }

  return 'Next';
}

function normalizeAnswer(text: string) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}
