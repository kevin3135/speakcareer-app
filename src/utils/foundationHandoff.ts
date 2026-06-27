export type FoundationHandoffInput = {
  coachNote: string;
  nextQuestTitle: string;
  starterAnswer: string;
};

export type FoundationHandoff = {
  body: string;
  coachNote: string;
  eyebrow: string;
  starterAnswer: string;
  starterLabel: string;
  title: string;
};

export function createFoundationHandoff({
  coachNote,
  nextQuestTitle,
  starterAnswer,
}: FoundationHandoffInput): FoundationHandoff {
  return {
    body: 'Use the same clear shape in your first interview answer.',
    coachNote,
    eyebrow: 'Next step',
    starterAnswer,
    starterLabel: 'Starter answer',
    title: nextQuestTitle,
  };
}
