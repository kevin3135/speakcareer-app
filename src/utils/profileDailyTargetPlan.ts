import type { DailyPracticeTarget } from '../types';

type ProfileDailyTargetStat = {
  label: string;
  value: string;
};

export type ProfileDailyTargetPlan = {
  badgeLabel: string;
  body: string;
  note: string;
  optionPaceLabel: string;
  stats: [ProfileDailyTargetStat, ProfileDailyTargetStat, ProfileDailyTargetStat];
  title: string;
};

const TARGET_CONFIG: Record<
  DailyPracticeTarget,
  Omit<ProfileDailyTargetPlan, 'stats' | 'title'>
> = {
  1: {
    badgeLabel: 'Steady streak',
    body: 'One short save keeps professional English active without turning practice into homework.',
    note: 'Best if you want one reliable five-minute rep before work or after dinner.',
    optionPaceLabel: 'Light',
  },
  2: {
    badgeLabel: 'Balanced pace',
    body: 'Two short saves build real speaking momentum while still fitting a normal workday.',
    note: 'Best if you can handle one core sprint and one quick follow-up rep.',
    optionPaceLabel: 'Balanced',
  },
  3: {
    badgeLabel: 'Focused push',
    body: 'Three short saves create a stronger interview-week sprint when you want extra repetition.',
    note: 'Best if you are preparing for a real interview, meeting, or presentation this week.',
    optionPaceLabel: 'Focused',
  },
};

export function createProfileDailyTargetPlan(
  dailyTarget: DailyPracticeTarget,
): ProfileDailyTargetPlan {
  const config = TARGET_CONFIG[dailyTarget];

  return {
    ...config,
    stats: [
      {
        label: 'This week',
        value: `${dailyTarget * 7} reps`,
      },
      {
        label: 'Daily time',
        value: `${dailyTarget * 5} min`,
      },
      {
        label: 'Rhythm',
        value: config.optionPaceLabel,
      },
    ],
    title: `${dailyTarget} ${dailyTarget === 1 ? 'roleplay' : 'roleplays'} a day`,
  };
}
