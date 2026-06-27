import type { RoleplayId } from '../types';

export type LevelAssessmentChoice = {
  body: string;
  id: 'starter' | 'basic' | 'confident';
  label: string;
  title: string;
};

export type GuidedIntroStep = {
  id: 'structure' | 'example' | 'practice';
  title: string;
  body: string;
};

export const levelAssessment: {
  choices: LevelAssessmentChoice[];
  progressPercent: number;
  question: string;
} = {
  choices: [
    {
      body: 'I know a few words, but I need simple sentence structure first.',
      id: 'starter',
      label: 'A1-A2',
      title: 'Start from basics',
    },
    {
      body: 'I can make simple sentences and want to sound clearer at work.',
      id: 'basic',
      label: 'B1',
      title: 'Build work English',
    },
    {
      body: 'I can explain my work, but I need confidence and sharper answers.',
      id: 'confident',
      label: 'B2',
      title: 'Polish professional English',
    },
  ],
  progressPercent: 18,
  question: 'How strong is your English today?',
};

export const guidedIntroSteps: GuidedIntroStep[] = [
  {
    id: 'structure',
    title: 'Learn the shape',
    body: 'Use one simple pattern before choosing scenarios.',
  },
  {
    id: 'example',
    title: 'Copy one example',
    body: 'See how a clear English answer is built.',
  },
  {
    id: 'practice',
    title: 'Use it at work',
    body: 'Then take the same structure into career practice.',
  },
];

export const foundationStart: {
  ctaLabel: string;
  example: string;
  nextLabel: string;
  structure: string[];
  subtitle: string;
  title: string;
} = {
  ctaLabel: 'Start lesson 1',
  example: 'I helped the team finish the project on time.',
  nextLabel: 'Next: Job Interview',
  structure: ['I', 'action', 'result'],
  subtitle: 'First learn the basic English answer shape. Career practice comes after.',
  title: 'Lesson 1: Build a clear sentence',
};

export const guidedStart: {
  detailLabels: string[];
  title: string;
  subtitle: string;
  ctaLabel: string;
  roleplayId: RoleplayId;
} = {
  detailLabels: ['5 minutes', '2-4 sentences', 'Clear rewrite'],
  title: 'Quest 1: Job Interview',
  subtitle: 'Start here: answer one interview prompt, get a clearer version and save it for XP.',
  ctaLabel: 'Start first quest',
  roleplayId: 'job-interview',
};
