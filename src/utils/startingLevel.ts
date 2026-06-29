import type { StartingLevelId } from '../types';

export type StartingLevelProfile = {
  answerPlaceholder: string;
  coachMessage: string;
  foundationExample: string;
  foundationExampleParts: [string, string, string];
  foundationRule: string;
  starterAnswer: string;
  starterEditSteps: [string, string, string];
};

const STARTING_LEVEL_PROFILES: Record<StartingLevelId, StartingLevelProfile> = {
  starter: {
    answerPlaceholder: 'Start with: I worked on... I helped... The result was...',
    coachMessage: 'Keep it simple. Use I + action + result, then move into the interview answer.',
    foundationExample: 'I organized the weekly report and sent it on time.',
    foundationExampleParts: ['I', 'organized the weekly report', 'and sent it on time.'],
    foundationRule: 'Keep it simple: say I, one action, and one clear result.',
    starterAnswer:
      'I worked on customer support tasks, and I helped the team reply faster. The result was happier customers.',
    starterEditSteps: [
      'Keep "I" first.',
      'Swap in your real task.',
      'End with one clear result.',
    ],
  },
  basic: {
    answerPlaceholder: 'Start with: Currently, I... One result I am proud of is...',
    coachMessage: 'Build the sentence, then use the same shape in your interview answer.',
    foundationExample: 'I helped the team finish the project on time.',
    foundationExampleParts: ['I', 'helped the team finish', 'the project on time.'],
    foundationRule: 'Say who did it, what happened, and why it mattered.',
    starterAnswer:
      'Currently, I help my team solve customer problems faster. One result I am proud of is improving the handoff process.',
    starterEditSteps: [
      'Start with your current role.',
      'Name one real improvement.',
      'Finish with the result you are proud of.',
    ],
  },
  confident: {
    answerPlaceholder: 'Start with: In my current role, I lead... As a result...',
    coachMessage: 'Keep it sharp. Lead with your action, then show the business result.',
    foundationExample: 'I led the project update and reduced delays for the team.',
    foundationExampleParts: ['I', 'led the project update', 'and reduced delays for the team.'],
    foundationRule: 'Lead with your action, then show the business result.',
    starterAnswer:
      'In my current role, I lead customer issue reviews and turn them into clear team actions. As a result, we solve problems faster and keep stakeholders informed.',
    starterEditSteps: [
      'Lead with your real ownership.',
      'Name one business action.',
      'Finish with the business result.',
    ],
  },
};

export function getStartingLevelProfile(startingLevelId: StartingLevelId | null | undefined): StartingLevelProfile {
  return STARTING_LEVEL_PROFILES[startingLevelId ?? 'basic'];
}
