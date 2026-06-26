export type AnswerCoachContent = {
  checklist: string[];
  instruction: string;
  placeholder: string;
  reviewCtaLabel: string;
  title: string;
  wordTargetLabel: string;
};

type AnswerCoachInput = {
  persona: string;
};

export function createAnswerCoachContent({ persona }: AnswerCoachInput): AnswerCoachContent {
  return {
    checklist: [
      'Answer the question directly.',
      'Add one concrete detail or result.',
      'Finish with a clear next step.',
    ],
    instruction: `Write a short spoken answer to the ${persona}. Two to four sentences is enough.`,
    placeholder: 'Example: Currently, I focus on... One result I am proud of is... That is why...',
    reviewCtaLabel: 'Review answer',
    title: 'Write your answer',
    wordTargetLabel: '2-4 sentences',
  };
}
