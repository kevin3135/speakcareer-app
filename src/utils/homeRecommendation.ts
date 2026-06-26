import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';

export type HomePracticeRecommendation = {
  ctaLabel: string;
  roleplayId: RoleplayId;
  subtitle: string;
  title: string;
};

export function createHomePracticeRecommendation(
  sessions: Pick<PracticeSession, 'roleplayId'>[],
  roleplays: Pick<RoleplayScenario, 'category' | 'focus' | 'id' | 'title'>[],
  defaultRecommendation: HomePracticeRecommendation,
): HomePracticeRecommendation {
  const latestSession = sessions[0];

  if (!latestSession) {
    return defaultRecommendation;
  }

  const currentIndex = roleplays.findIndex((roleplay) => roleplay.id === latestSession.roleplayId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % roleplays.length;
  const nextPractice = roleplays[nextIndex];

  if (!nextPractice) {
    return defaultRecommendation;
  }

  return {
    ctaLabel: 'Start next roleplay',
    roleplayId: nextPractice.id,
    subtitle: `Your last sprint is saved. Train a different ${nextPractice.category.toLowerCase()} skill: ${nextPractice.focus}.`,
    title: `Next: ${nextPractice.title}`,
  };
}
