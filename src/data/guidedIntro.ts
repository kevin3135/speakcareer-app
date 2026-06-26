import type { RoleplayId } from '../types';

export type GuidedIntroStep = {
  id: 'choose' | 'answer' | 'review';
  title: string;
  body: string;
};

export const guidedIntroSteps: GuidedIntroStep[] = [
  {
    id: 'choose',
    title: 'Read one interview prompt',
    body: 'Start with one clear question. No need to browse the whole app first.',
  },
  {
    id: 'answer',
    title: 'Write 2-4 sentences',
    body: 'Keep it short, spoken and professional.',
  },
  {
    id: 'review',
    title: 'Get one better version',
    body: 'Review what worked, what to improve and what to say instead.',
  },
];

export const guidedStart: {
  detailLabels: string[];
  title: string;
  subtitle: string;
  ctaLabel: string;
  roleplayId: RoleplayId;
} = {
  detailLabels: ['5 minutes', '2-4 sentences', 'Clear rewrite'],
  title: 'First sprint: Job Interview',
  subtitle: 'Do one simple English interview answer first. The app guides the rest.',
  ctaLabel: 'Start first sprint',
  roleplayId: 'job-interview',
};
