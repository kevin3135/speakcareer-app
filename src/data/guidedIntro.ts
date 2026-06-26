import type { RoleplayId } from '../types';

export type GuidedIntroStep = {
  id: 'choose' | 'answer' | 'review';
  title: string;
  body: string;
};

export const guidedIntroSteps: GuidedIntroStep[] = [
  {
    id: 'choose',
    title: 'Choose one work situation',
    body: 'Start with a real career moment, such as an interview or meeting.',
  },
  {
    id: 'answer',
    title: 'Write one short answer',
    body: 'Practice spoken English in a small 5-minute sprint.',
  },
  {
    id: 'review',
    title: 'Review simple feedback',
    body: 'See what worked, what to improve and what to say next.',
  },
];

export const guidedStart: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  roleplayId: RoleplayId;
} = {
  title: 'Start with Job Interview',
  subtitle: 'A calm first English sprint for the most common career moment.',
  ctaLabel: 'Start guided practice',
  roleplayId: 'job-interview',
};
