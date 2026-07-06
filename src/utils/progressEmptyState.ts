export type ProgressEmptyState = {
  action: {
    body: string;
    ctaLabel: string;
    target: 'foundation' | 'roleplay';
    title: string;
  };
  body: string;
  eyebrow: string;
  progressLabel: string;
  title: string;
  unlockLabel: string;
};

type CreateProgressEmptyStateInput = {
  foundationTitle: string;
  hasCompletedFoundation: boolean;
  nextRoleplayTitle: string;
};

export function createProgressEmptyState({
  foundationTitle,
  hasCompletedFoundation,
  nextRoleplayTitle,
}: CreateProgressEmptyStateInput): ProgressEmptyState {
  return {
    action: hasCompletedFoundation
      ? {
        body: `Your first guided save is ${nextRoleplayTitle}. One short answer unlocks this history.`,
        ctaLabel: 'Continue today',
        target: 'roleplay',
        title: nextRoleplayTitle,
      }
      : {
        body: `${foundationTitle} is still the shortest route into your first saved answer.`,
        ctaLabel: 'Continue today',
        target: 'foundation',
        title: foundationTitle,
      },
    body: 'Your first saved answer will appear here with the scenario, feedback summary and XP reward.',
    eyebrow: 'Locked until first save',
    progressLabel: '0/1 saved',
    title: 'Session history starts after one save',
    unlockLabel: 'First unlock: history, XP and daily target progress',
  };
}
