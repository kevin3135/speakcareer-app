export type AnswerCoachContent = {
  checklist: string[];
  instruction: string;
  placeholder: string;
  phraseLabel: string;
  reviewCtaLabel: string;
  title: string;
  transitionBody: string;
  transitionTitle: string;
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
    placeholder: 'Start with: Currently, I focus on... One result I am proud of is... That is why...',
    phraseLabel: 'Helpful phrases',
    reviewCtaLabel: 'Review answer',
    title: 'Write your answer',
    transitionBody: 'Use the prompt above. Keep it short, spoken and specific.',
    transitionTitle: 'Now write your answer',
    wordTargetLabel: '2-4 sentences',
  };
}
