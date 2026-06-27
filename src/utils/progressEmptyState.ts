export type ProgressEmptyState = {
  body: string;
  eyebrow: string;
  progressLabel: string;
  title: string;
  unlockLabel: string;
};

export function createProgressEmptyState(): ProgressEmptyState {
  return {
    body: 'Your first saved answer will appear here with the scenario, feedback summary and XP reward.',
    eyebrow: 'Locked until first save',
    progressLabel: '0/1 saved',
    title: 'Session history starts after one save',
    unlockLabel: 'First unlock: history, XP and daily target progress',
  };
}
