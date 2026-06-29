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
      body: 'Write your first response now.',
    };
  }

  if (!review.isReadyForFeedback) {
    return {
      badgeLabel,
      body: 'Add one work example, then check.',
    };
  }

  if (review.readinessLabel === 'Good start') {
    return {
      badgeLabel,
      body: 'Add one result or next step.',
    };
  }

  return {
    badgeLabel,
    body: 'Ready to check. Save XP next.',
  };
}
