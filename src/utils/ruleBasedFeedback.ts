import type { AIFeedback, RoleplayScenario } from '../types';
import type { AnswerReview } from './answerReview';

export type RuleBasedFeedbackResult = {
  feedback: AIFeedback;
  xpReward: number;
  rewardLabel: string;
};

const resultMarkers = [
  'as a result',
  'result',
  'outcome',
  'impact',
  'improved',
  'increased',
  'decreased',
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

const professionalMarkers = [
  'align',
  'priority',
  'deadline',
  'customer',
  'client',
  'team',
  'manager',
  'stakeholder',
  'follow up',
  'next step',
  'recommend',
  'decision',
];

const hesitantMarkers = ['i think', 'maybe', 'kind of', 'sort of', 'probably', 'i guess'];

export function createRuleBasedFeedback(
  roleplay: RoleplayScenario,
  answer: string,
  review: AnswerReview,
): RuleBasedFeedbackResult {
  const normalizedAnswer = answer.trim().toLowerCase();
  const hasResult = hasAnyMarker(normalizedAnswer, resultMarkers) || /\d|%/.test(normalizedAnswer);
  const hasStructure = hasAnyMarker(normalizedAnswer, structureMarkers);
  const hasProfessionalLanguage = hasAnyMarker(normalizedAnswer, professionalMarkers);
  const hasHesitation = hasAnyMarker(normalizedAnswer, hesitantMarkers);
  const isTooLong = review.wordCount > 90;

  const baseScore = review.isReadyForFeedback ? 66 : 42;
  const feedback: AIFeedback = {
    summary: createSummary(roleplay, review, hasResult, hasStructure),
    strengths: createStrengths(review, hasResult, hasStructure, hasProfessionalLanguage),
    improvements: createImprovements(review, hasResult, hasStructure, hasHesitation, isTooLong),
    suggestedRewrite: createSuggestedRewrite(roleplay),
    scores: [
      {
        label: 'Clarity',
        value: clampScore(baseScore + (hasProfessionalLanguage ? 10 : 0) + (isTooLong ? -10 : 0)),
      },
      {
        label: 'Confidence',
        value: clampScore(baseScore + (hasResult ? 12 : 0) + (hasHesitation ? -14 : 0)),
      },
      {
        label: 'Structure',
        value: clampScore(baseScore + (hasStructure ? 14 : -6) + (hasResult ? 5 : 0)),
      },
      {
        label: 'Vocabulary',
        value: clampScore(baseScore + (hasProfessionalLanguage ? 12 : 0) + (hasHesitation ? -5 : 0)),
      },
    ],
  };

  const xpReward = calculateXpReward(review, hasResult, hasStructure, hasProfessionalLanguage, isTooLong);

  return {
    feedback,
    xpReward,
    rewardLabel: createRewardLabel(xpReward, review.isReadyForFeedback),
  };
}

function hasAnyMarker(value: string, markers: string[]) {
  return markers.some((marker) => value.includes(marker));
}

function clampScore(value: number) {
  return Math.max(25, Math.min(95, value));
}

function createSummary(
  roleplay: RoleplayScenario,
  review: AnswerReview,
  hasResult: boolean,
  hasStructure: boolean,
) {
  if (!review.isReadyForFeedback) {
    return `This is a start for ${roleplay.title.toLowerCase()}, but it needs one concrete work example before it sounds ready.`;
  }

  if (hasResult && hasStructure) {
    return `Strong ${roleplay.title.toLowerCase()} answer. It gives structure and impact, so it sounds close to a professional spoken response.`;
  }

  if (hasResult) {
    return `Good answer with clear impact. Add one simple structure marker like "First" or "Next" to make it easier to follow.`;
  }

  if (hasStructure) {
    return `Clear structure. Add one measurable result or business outcome so the answer feels more convincing.`;
  }

  return `Useful first answer. Add a clearer beginning, action and result to make it sound more polished at work.`;
}

function createStrengths(
  review: AnswerReview,
  hasResult: boolean,
  hasStructure: boolean,
  hasProfessionalLanguage: boolean,
) {
  const strengths: string[] = [];

  if (review.wordCount >= 35) {
    strengths.push('The answer has enough detail for meaningful feedback.');
  } else if (review.isReadyForFeedback) {
    strengths.push('The answer is concise and direct.');
  } else {
    strengths.push('You started the response instead of leaving the prompt blank.');
  }

  if (hasResult) {
    strengths.push('You included impact or a measurable outcome.');
  }

  if (hasStructure) {
    strengths.push('The answer uses structure that makes it easier to follow.');
  }

  if (hasProfessionalLanguage) {
    strengths.push('The wording fits a workplace conversation.');
  }

  return strengths.slice(0, 3);
}

function createImprovements(
  review: AnswerReview,
  hasResult: boolean,
  hasStructure: boolean,
  hasHesitation: boolean,
  isTooLong: boolean,
) {
  const improvements: string[] = [];

  if (!review.isReadyForFeedback) {
    improvements.push('Add one concrete action you took or would take.');
  }

  if (!hasStructure) {
    improvements.push('Use a simple structure: context, action, result.');
  }

  if (!hasResult) {
    improvements.push('Add a result, decision or next step to make the answer stronger.');
  }

  if (hasHesitation) {
    improvements.push('Remove hesitant phrases like "maybe" or "I think" when you know your point.');
  }

  if (isTooLong) {
    improvements.push('Shorten the answer so it is easier to say out loud.');
  }

  return improvements.slice(0, 3);
}

function createSuggestedRewrite(roleplay: RoleplayScenario) {
  switch (roleplay.id) {
    case 'job-interview':
      return 'In my previous role, I handled a similar challenge by clarifying the goal first, then taking ownership of the next steps. As a result, the team had a clearer plan and we could move faster.';
    case 'meeting-practice':
      return 'I agree with the main goal. First, I would clarify the priority, then confirm the owner and deadline. My next step would be to follow up with a short written summary.';
    case 'presentation-practice':
      return 'The main point is that this approach helps the team focus on the highest-impact work. I would start with the problem, explain the recommendation and close with the next decision we need.';
    case 'sales-call':
      return 'I understand that concern. First, I would clarify what matters most to you, then connect the solution to that priority. If it makes sense, the next step is a short follow-up with the details.';
    case 'workplace-small-talk':
      return 'That sounds interesting. I would ask one follow-up question, share a short relevant detail and keep the tone friendly but professional.';
  }
}

function calculateXpReward(
  review: AnswerReview,
  hasResult: boolean,
  hasStructure: boolean,
  hasProfessionalLanguage: boolean,
  isTooLong: boolean,
) {
  if (review.wordCount === 0) {
    return 0;
  }

  let xp = review.isReadyForFeedback ? 25 : 10;

  if (review.wordCount >= 35) {
    xp += 10;
  }

  if (hasResult) {
    xp += 10;
  }

  if (hasStructure) {
    xp += 5;
  }

  if (hasProfessionalLanguage) {
    xp += 5;
  }

  if (isTooLong) {
    xp -= 10;
  }

  return Math.max(0, Math.min(60, xp));
}

function createRewardLabel(xpReward: number, isReadyForFeedback: boolean) {
  if (xpReward >= 50) {
    return 'Career-ready response';
  }

  if (xpReward >= 35) {
    return 'Strong practice win';
  }

  if (isReadyForFeedback) {
    return 'Practice session ready';
  }

  if (xpReward > 0) {
    return 'Draft XP';
  }

  return 'No XP yet';
}
