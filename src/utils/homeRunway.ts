import type { HomeDailyMissionCard } from './homeDailyMission';
import type { HomeLearnStep } from './homeLearnState';

export type HomeRunwayCard = {
  body: string;
  eyebrow: string;
  progressLabel?: string;
  progressPercent?: number;
  title: string;
};

export type HomeRunwayState = {
  badgeLabel: string;
  cards: [HomeRunwayCard, HomeRunwayCard];
  title: string;
};

type CreateHomeRunwayInput = {
  missionCard: Pick<HomeDailyMissionCard, 'meta' | 'progressLabel' | 'progressPercent' | 'rewardLabel' | 'targetLabel'>;
  nextUnlock: Pick<HomeLearnStep, 'state' | 'title'> | null;
};

export function createHomeRunway({
  missionCard,
  nextUnlock,
}: CreateHomeRunwayInput): HomeRunwayState {
  const isMissionComplete = missionCard.progressPercent >= 100;
  const nextStepIsReplay = nextUnlock?.state === 'completed';

  return {
    badgeLabel: isMissionComplete ? 'Bonus loop' : 'Today + next',
    cards: [
      {
        body: isMissionComplete
          ? `${missionCard.rewardLabel} locked in.`
          : `${missionCard.meta}, ${missionCard.rewardLabel}`,
        eyebrow: isMissionComplete ? 'Today done' : 'Today',
        progressLabel: missionCard.progressLabel,
        progressPercent: missionCard.progressPercent,
        title: missionCard.targetLabel,
      },
      {
        body: nextUnlock
          ? nextStepIsReplay
            ? 'All core steps are clear. Replay this one for extra reps and XP.'
            : 'Save the current sprint to open this next.'
          : 'Keep saving guided answers to keep the path moving.',
        eyebrow: nextUnlock ? (nextStepIsReplay ? 'Replay next' : 'Next unlock') : 'Path ready',
        title: nextUnlock?.title ?? 'Career path ready',
      },
    ],
    title: isMissionComplete ? 'Keep the streak warm' : 'See the next payoff',
  };
}
