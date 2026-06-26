import type { RoleplayId, RoleplayScenario } from '../types';

export type PracticeCompletionSummary = {
  title: string;
  rewardLabel: string;
  body: string;
  nextAction: string;
};

export type NextPracticeRecommendation = {
  roleplayId: RoleplayId;
  title: string;
  reason: string;
  ctaLabel: string;
};

type CreatePracticeCompletionSummaryInput = {
  roleplayTitle: string;
  xpReward: number;
  includedFollowUp: boolean;
};

export function createPracticeCompletionSummary({
  roleplayTitle,
  xpReward,
  includedFollowUp,
}: CreatePracticeCompletionSummaryInput): PracticeCompletionSummary {
  return {
    title: `${roleplayTitle} saved`,
    rewardLabel: createRewardLabel(xpReward),
    body: includedFollowUp
      ? 'Your first answer and follow-up are saved to Progress with local mock feedback.'
      : 'Your first answer is saved to Progress with local mock feedback.',
    nextAction: includedFollowUp
      ? 'Start a fresh practice angle while the conversation is still warm.'
      : 'Try the follow-up round next time to earn bonus XP and deepen the answer.',
  };
}

export function createNextPracticeRecommendation(
  currentRoleplayId: RoleplayId,
  roleplays: Pick<RoleplayScenario, 'category' | 'focus' | 'id' | 'title'>[],
): NextPracticeRecommendation | null {
  if (roleplays.length === 0) {
    return null;
  }

  const currentIndex = roleplays.findIndex((roleplay) => roleplay.id === currentRoleplayId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % roleplays.length;
  const nextRoleplay = roleplays[nextIndex];

  return {
    roleplayId: nextRoleplay.id,
    title: nextRoleplay.title,
    reason: `Train a different ${nextRoleplay.category.toLowerCase()} skill: ${nextRoleplay.focus}.`,
    ctaLabel: 'Start next roleplay',
  };
}

function createRewardLabel(xpReward: number) {
  if (xpReward >= 65) {
    return 'Career-ready sprint';
  }

  if (xpReward >= 45) {
    return 'Strong practice win';
  }

  return 'Practice banked';
}
