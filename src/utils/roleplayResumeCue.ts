import type { AnswerReview } from './answerReview';

export type RoleplayResumeCue = {
  badgeLabel: string;
  body: string;
};

export function createRoleplayResumeCue(review: AnswerReview): RoleplayResumeCue {
  const badgeLabel = `${review.wordCount} ${review.wordCount === 1 ? 'word' : 'words'}`;

  if (review.wordCount === 0) {
    return {
      badgeLabel,
      body: 'Saved draft: write your first response now.',
    };
  }

  if (!review.isReadyForFeedback) {
    return {
      badgeLabel,
      body: 'Saved draft: add one concrete action or work example, then check.',
    };
  }

  if (review.readinessLabel === 'Good start') {
    return {
      badgeLabel,
      body: 'Saved draft: add one result or next step, or check now.',
    };
  }

  return {
    badgeLabel,
    body: 'Saved draft: ready to check, save XP and unlock the next step.',
  };
}
