import type { RoleplayScenario } from '../types';
import type { AnswerReview } from './answerReview';

export type FollowUpFocus = 'detail' | 'result' | 'structure' | 'confidence' | 'next-step';

export type AdaptiveFollowUpPrompt = {
  focus: FollowUpFocus;
  focusLabel: string;
  coachingNote: string;
  prompt: string;
  stepLabel: string;
  starterAnswer: string;
};

const resultMarkers = [
  'as a result',
  'result',
  'outcome',
  'impact',
  'improved',
  'increased',
  'reduced',
  'saved',
  'delivered',
  'resolved',
];

const structureMarkers = [
  'first',
  'second',
  'finally',
  'then',
  'because',
  'therefore',
  'my goal',
  'i would',
  'i started',
];

const hesitantMarkers = ['i think', 'maybe', 'kind of', 'sort of', 'probably', 'i guess'];

export function createAdaptiveFollowUpPrompt(
  roleplay: RoleplayScenario,
  answer: string,
  review: AnswerReview,
): AdaptiveFollowUpPrompt {
  const normalizedAnswer = answer.trim().toLowerCase();
  const hasResult = hasAnyMarker(normalizedAnswer, resultMarkers) || /\d|%/.test(normalizedAnswer);
  const hasStructure = hasAnyMarker(normalizedAnswer, structureMarkers);
  const hasHesitation = hasAnyMarker(normalizedAnswer, hesitantMarkers);
  const stepLabel = createStepLabel(roleplay.aiPersona);

  if (!review.isReadyForFeedback) {
    return {
      focus: 'detail',
      focusLabel: 'Add detail',
      coachingNote: 'Your first answer needs one concrete workplace example before it sounds complete.',
      prompt: `Can you add one specific action you took or would take in this ${roleplay.title.toLowerCase()} situation?`,
      stepLabel,
      starterAnswer: 'One specific action I would take is to clarify the goal and take ownership of the next step.',
    };
  }

  if (!hasResult) {
    return {
      focus: 'result',
      focusLabel: 'Add impact',
      coachingNote: 'A result makes your answer sound more credible and career-ready.',
      prompt: createResultPrompt(roleplay),
      stepLabel,
      starterAnswer: 'As a result, the team had a clearer next step and could move faster.',
    };
  }

  if (!hasStructure) {
    return {
      focus: 'structure',
      focusLabel: 'Tighten structure',
      coachingNote: 'Structure helps the listener follow your thinking under pressure.',
      prompt: 'Can you answer the same point using this flow: context, action, result?',
      stepLabel,
      starterAnswer: 'The context was clear, my action was focused, and the result helped the team move forward.',
    };
  }

  if (hasHesitation) {
    return {
      focus: 'confidence',
      focusLabel: 'Sound confident',
      coachingNote: 'Replacing hesitant phrases makes your English sound more decisive.',
      prompt: 'How would you say the same idea again without using "maybe", "I think" or similar softeners?',
      stepLabel,
      starterAnswer: 'I would handle it by choosing one clear next step and communicating it directly.',
    };
  }

  return {
    focus: 'next-step',
    focusLabel: 'Go deeper',
    coachingNote: 'Your first answer is ready, so the next step is handling a realistic follow-up.',
    prompt: roleplay.followUpPrompts[0],
    stepLabel,
    starterAnswer: 'The next step I would suggest is to confirm the priority and agree who owns it.',
  };
}

function hasAnyMarker(value: string, markers: string[]) {
  return markers.some((marker) => value.includes(marker));
}

function createResultPrompt(roleplay: RoleplayScenario) {
  switch (roleplay.id) {
    case 'job-interview':
      return 'What measurable result or business impact can you add to make your interview answer stronger?';
    case 'meeting-practice':
      return 'What decision, owner or next step should the team have after hearing your update?';
    case 'presentation-practice':
      return 'What outcome should the audience remember or approve after your presentation?';
    case 'sales-call':
      return 'What customer value or business impact would make your response more persuasive?';
    case 'workplace-small-talk':
      return 'What friendly follow-up question would keep the conversation moving naturally?';
  }
}

function createStepLabel(aiPersona: string) {
  return `${aiPersona} follow-up`;
}
