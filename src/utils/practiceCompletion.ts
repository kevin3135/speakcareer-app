export type PracticeCompletionSummary = {
  title: string;
  rewardLabel: string;
  body: string;
  nextAction: string;
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

function createRewardLabel(xpReward: number) {
  if (xpReward >= 65) {
    return 'Career-ready sprint';
  }

  if (xpReward >= 45) {
    return 'Strong practice win';
  }

  return 'Practice banked';
}
