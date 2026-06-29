export type FoundationWarmupPanel = {
  body: string;
  coachLabel: string;
  starterAnswer: string;
  starterLabel: string;
  title: string;
};

type FoundationWarmupPanelInput = {
  note: string;
  starterAnswer: string;
};

export function createFoundationWarmupPanel({
  note,
  starterAnswer,
}: FoundationWarmupPanelInput): FoundationWarmupPanel {
  const hasCoachNote = note.trim().length > 0;

  return {
    body: hasCoachNote
      ? 'Edit this first line so it matches your real work, then check it.'
      : 'Use this first line to begin faster, then check it.',
    coachLabel: 'Coach note',
    starterAnswer,
    starterLabel: 'Loaded starter',
    title: 'Lesson 1 starter is ready',
  };
}
