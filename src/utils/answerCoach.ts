import type { RoleplayPromptVariant } from '../types';

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
  promptVariant?: RoleplayPromptVariant;
};

export function createAnswerCoachContent({ persona, promptVariant }: AnswerCoachInput): AnswerCoachContent {
  return {
    checklist: [
      'Answer the question directly.',
      'Add one concrete detail or result.',
      'Finish with a clear next step.',
    ],
    instruction: 'Answer in 2-4 spoken sentences.',
    placeholder: createAnswerPlaceholder(promptVariant),
    phraseLabel: 'Helpful phrases',
    reviewCtaLabel: 'Review answer',
    title: 'Write your answer',
    transitionBody: 'Use the prompt above. Keep it short, spoken and specific.',
    transitionTitle: 'Now write your answer',
    wordTargetLabel: '2-4 sentences',
  };
}

function createAnswerPlaceholder(promptVariant?: RoleplayPromptVariant) {
  if (promptVariant?.suggestedPhrases?.length) {
    return `Start with: ${promptVariant.suggestedPhrases.join(' ')}`;
  }

  return 'Start with: Currently, I focus on... One result I am proud of is... That is why...';
}
