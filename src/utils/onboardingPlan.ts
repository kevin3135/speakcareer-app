import type { DailyPracticeTarget } from '../types';

type OnboardingPlanStep = {
  detail: string;
  label: string;
  title: string;
};

type OnboardingFirstSaveMilestone = {
  badgeLabel: string;
  body: string;
  progressLabel: string;
  progressPercent: number;
  title: string;
  tone: 'info' | 'success';
};

export type OnboardingPlanPreviewInput = {
  coachNote: string;
  dailyTarget: DailyPracticeTarget;
  firstLessonDetail: string;
  firstLessonTitle: string;
  firstQuestSubtitle: string;
  firstQuestTitle: string;
  levelLabel: string;
  starterAnswer: string;
  starterEditSteps: [string, string, string];
};

export type OnboardingPlanPreview = {
  commitmentNote: string;
  commitmentTitle: string;
  ctaLabel: string;
  coachNote: string;
  dailyTargetLabel: string;
  dailyTargetNote: string;
  firstSaveMilestone: OnboardingFirstSaveMilestone;
  levelLabel: string;
  nextQuestTitleShort: string;
  sessionBadgeLabel: string;
  sessionNote: string;
  sessionSteps: [OnboardingPlanStep, OnboardingPlanStep, OnboardingPlanStep];
  sessionTitle: string;
  starterAnswer: string;
  starterEditSteps: [string, string, string];
  steps: [OnboardingPlanStep, OnboardingPlanStep];
  title: string;
};

export function createOnboardingPlanPreview({
  coachNote,
  dailyTarget,
  firstLessonDetail,
  firstLessonTitle,
  firstQuestSubtitle,
  firstQuestTitle,
  levelLabel,
  starterAnswer,
  starterEditSteps,
}: OnboardingPlanPreviewInput): OnboardingPlanPreview {
  const nextQuestTitleShort = createShortQuestTitle(firstQuestTitle);

  return {
    commitmentNote: createCommitmentNote(dailyTarget, nextQuestTitleShort),
    commitmentTitle: `${firstLessonTitle} now. ${nextQuestTitleShort} next.`,
    ctaLabel: `Start ${levelLabel} path`,
    coachNote,
    dailyTargetLabel: createDailyTargetLabel(dailyTarget),
    dailyTargetNote: createDailyTargetNote(dailyTarget),
    firstSaveMilestone: createFirstSaveMilestone(dailyTarget, nextQuestTitleShort),
    levelLabel,
    nextQuestTitleShort,
    sessionBadgeLabel: 'First 5 min',
    sessionNote: createSessionNote(dailyTarget, nextQuestTitleShort),
    sessionSteps: [
      {
        detail: firstLessonDetail,
        label: '1',
        title: firstLessonTitle,
      },
      {
        detail: firstQuestSubtitle,
        label: '2',
        title: nextQuestTitleShort,
      },
      {
        detail: 'Get one clearer rewrite, one next focus, and save the win for XP.',
        label: '3',
        title: 'Coach review',
      },
    ],
    sessionTitle: 'Your first practice loop',
    starterAnswer,
    starterEditSteps,
    steps: [
      {
        detail: firstLessonDetail,
        label: 'Lesson 1',
        title: firstLessonTitle,
      },
      {
        detail: firstQuestSubtitle,
        label: 'Quest 1',
        title: firstQuestTitle,
      },
    ],
    title: 'Your first English path',
  };
}

function createDailyTargetLabel(dailyTarget: DailyPracticeTarget) {
  return `${dailyTarget} ${dailyTarget === 1 ? 'roleplay' : 'roleplays'} a day`;
}

function createDailyTargetNote(dailyTarget: DailyPracticeTarget) {
  if (dailyTarget === 1) {
    return 'Light start. Best for a steady five-minute work-English habit.';
  }

  if (dailyTarget === 2) {
    return 'Balanced pace. Enough repetition to build confidence faster.';
  }

  return 'Focused push. Best when you want extra interview reps today.';
}

function createShortQuestTitle(firstQuestTitle: string) {
  return firstQuestTitle.replace(/^Quest \d+:\s*/, '');
}

function createCommitmentNote(dailyTarget: DailyPracticeTarget, nextQuestTitleShort: string) {
  if (dailyTarget === 1) {
    return `Lesson now. First ${nextQuestTitleShort} save today.`;
  }

  if (dailyTarget === 2) {
    return `Lesson now. 2 saves today, starting with ${nextQuestTitleShort}.`;
  }

  return `Lesson now. 3 saves today, starting with ${nextQuestTitleShort}.`;
}

function createSessionNote(dailyTarget: DailyPracticeTarget, nextQuestTitleShort: string) {
  if (dailyTarget === 1) {
    return `Finish one ${nextQuestTitleShort} save today. That is enough to start the habit.`;
  }

  if (dailyTarget === 2) {
    return `Save your first ${nextQuestTitleShort} answer now, then come back for one more roleplay later today.`;
  }

  return `Save your first ${nextQuestTitleShort} answer now, then keep going with two more short roleplays later today.`;
}

function createFirstSaveMilestone(
  dailyTarget: DailyPracticeTarget,
  nextQuestTitleShort: string,
): OnboardingFirstSaveMilestone {
  const completedAfterFirstSave = 1;
  const remainingAfterFirstSave = Math.max(dailyTarget - completedAfterFirstSave, 0);

  if (remainingAfterFirstSave === 0) {
    return {
      badgeLabel: `After save ${completedAfterFirstSave}/${dailyTarget}`,
      body: `Your first saved ${nextQuestTitleShort} answer starts your streak, unlocks Progress, and completes today's target.`,
      progressLabel: `After save: ${completedAfterFirstSave}/${dailyTarget} roleplay today`,
      progressPercent: 100,
      title: 'Day 1 target complete',
      tone: 'success',
    };
  }

  const remainingLabel =
    remainingAfterFirstSave === 1
      ? 'One more sprint later today'
      : `${remainingAfterFirstSave} more sprints later today`;
  const roleplayLabel = remainingAfterFirstSave === 1 ? 'roleplay' : 'roleplays';

  return {
    badgeLabel: `After save ${completedAfterFirstSave}/${dailyTarget}`,
    body: `Your first saved ${nextQuestTitleShort} answer starts your streak and unlocks Progress. Save ${remainingAfterFirstSave} more short ${roleplayLabel} later today to close the target.`,
    progressLabel: `After save: ${completedAfterFirstSave}/${dailyTarget} roleplays today`,
    progressPercent: Math.round((completedAfterFirstSave / dailyTarget) * 100),
    title: remainingLabel,
    tone: 'info',
  };
}
