export type ProgressFirstWinReturnCue = {
  badgeLabel: string;
  body: string;
  label: string;
  title: string;
};

type CreateProgressFirstWinReturnCueInput = {
  ctaLabel: string;
  isDailyTargetComplete: boolean;
  streakDays: number;
};

export function createProgressFirstWinReturnCue({
  ctaLabel,
  isDailyTargetComplete,
  streakDays,
}: CreateProgressFirstWinReturnCueInput): ProgressFirstWinReturnCue {
  const nextAction = ctaLabel.trim() || 'Start your next sprint';

  return {
    badgeLabel: `${streakDays} day streak`,
    body: isDailyTargetComplete
      ? `Today's target is complete. ${nextAction} tomorrow to keep the streak active and reuse today's correction in a fresh work rep.`
      : `If you stop here today, ${nextAction} tomorrow to keep the streak active and reuse today's correction in a fresh work rep.`,
    label: 'Return tomorrow',
    title: `${nextAction} first`,
  };
}
