import type {
  DailyPracticeTarget,
  PracticeSession,
  ProgressSummary,
  RoleplayId,
  RoleplayScenario,
} from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createLocalProgressStats, type LocalProgressStats } from './localProgress.ts';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';

export type PracticeCompletionSummary = {
  title: string;
  rewardLabel: string;
  body: string;
  nextAction: string;
  progressCtaLabel: string;
};

export type PracticeSavePrompt = {
  body: string;
  ctaLabel: string;
  eyebrow: string;
  followUpLabel: string;
  title: string;
  xpLabel: string;
};

export type NextPracticeRecommendation = {
  roleplayId: RoleplayId;
  title: string;
  reason: string;
  ctaLabel: string;
};

export type SavedRoleplayHandoff = {
  body: string;
  ctaLabel: string;
  ctaTarget: 'progress' | 'roleplay';
  nextLabel: string;
  nextTitle: string;
  title: string;
  xpLabel: string;
};

export type PracticeCompletionMilestone = {
  title: string;
  body: string;
  todayValue: string;
  streakValue: string;
};

export type SavedRoleplayMilestone = PracticeCompletionMilestone & {
  progressLabel: string;
  progressPercent: number;
};

export type SavedRoleplayPathProgress = {
  badgeLabel: string;
  isPathComplete: boolean;
  nextLabel: string;
  nextTitle: string;
  progressLabel: string;
  progressPercent: number;
  roleplayId: RoleplayId;
  title: string;
};

type CreatePracticeCompletionSummaryInput = {
  roleplayTitle: string;
  xpReward: number;
  includedFollowUp: boolean;
};

type CreatePracticeSavePromptInput = {
  includedFollowUp: boolean;
  xpReward: number;
};

export function createPracticeSavePrompt({
  includedFollowUp,
  xpReward,
}: CreatePracticeSavePromptInput): PracticeSavePrompt {
  const safeXpReward = Math.max(0, xpReward);

  return {
    body: includedFollowUp
      ? 'Save both turns to Progress and lock in this practice win.'
      : 'Save now, or answer the follow-up first for bonus XP.',
    ctaLabel: `Complete lesson (+${safeXpReward} XP)`,
    eyebrow: 'Finish lesson',
    followUpLabel: includedFollowUp ? 'Follow-up included' : 'Follow-up optional',
    title: 'Ready to complete this lesson',
    xpLabel: `+${safeXpReward} XP`,
  };
}

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
    progressCtaLabel: 'Review Progress',
  };
}

export function createNextPracticeRecommendation(
  currentRoleplayId: RoleplayId,
  roleplays: Pick<RoleplayScenario, 'category' | 'focus' | 'id' | 'title'>[],
): NextPracticeRecommendation | null {
  if (roleplays.length === 0) {
    return null;
  }

  const currentIndex = roleplays.findIndex((roleplay) => roleplay.id === currentRoleplayId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % roleplays.length;
  const nextRoleplay = roleplays[nextIndex];

  return {
    roleplayId: nextRoleplay.id,
    title: nextRoleplay.title,
    reason: `Train a different ${nextRoleplay.category.toLowerCase()} skill: ${nextRoleplay.focus}.`,
    ctaLabel: 'Start next roleplay',
  };
}

type CreateSavedRoleplayHandoffInput = {
  isPathComplete?: boolean;
  nextPracticeTitle: string | null;
  xpReward: number;
};

export function createSavedRoleplayHandoff({
  isPathComplete = false,
  nextPracticeTitle,
  xpReward,
}: CreateSavedRoleplayHandoffInput): SavedRoleplayHandoff {
  const safeXpReward = Math.max(0, xpReward);

  if (!nextPracticeTitle) {
    return {
      body: 'Your answer is saved. Review Progress now, or come back later for another short English sprint.',
      ctaLabel: 'Open Progress',
      ctaTarget: 'progress',
      nextLabel: 'Next stop',
      nextTitle: 'Progress',
      title: 'Saved',
      xpLabel: `+${safeXpReward} XP`,
    };
  }

  return {
    body: isPathComplete
      ? `Your answer is saved. You cleared the full career path. Replay ${nextPracticeTitle} to keep the streak professional and sharp.`
      : 'Your answer is saved. Keep the streak moving with one more guided workplace conversation.',
    ctaLabel: `${isPathComplete ? 'Replay' : 'Start'} ${nextPracticeTitle}`,
    ctaTarget: 'roleplay',
    nextLabel: 'Next lesson',
    nextTitle: nextPracticeTitle,
    title: 'Saved',
    xpLabel: `+${safeXpReward} XP`,
  };
}

type CreatePracticeCompletionMilestoneInput = {
  dailyTarget: DailyPracticeTarget;
  progress: Pick<
    LocalProgressStats,
    'currentStreakDays' | 'targetSessionsCompleted' | 'targetSessionsRemaining'
  >;
};

type CreateSavedRoleplayMilestoneInput = {
  dailyTarget: DailyPracticeTarget;
  savedSession: PracticeSession;
  sessions: PracticeSession[];
  summary: ProgressSummary;
};

type CreateSavedRoleplayPathProgressInput = {
  roleplays: Pick<RoleplayScenario, 'category' | 'durationMinutes' | 'id' | 'targetLevel' | 'title'>[];
  savedSession: Pick<PracticeSession, 'id' | 'roleplayId'>;
  sessions: Pick<PracticeSession, 'id' | 'roleplayId'>[];
};

export function createPracticeCompletionMilestone({
  dailyTarget,
  progress,
}: CreatePracticeCompletionMilestoneInput): PracticeCompletionMilestone {
  const isTargetComplete = progress.targetSessionsRemaining === 0;
  const remainingLabel =
    progress.targetSessionsRemaining === 1 ? 'One more sprint today' : `${progress.targetSessionsRemaining} sprints left today`;

  return {
    title: isTargetComplete ? 'Daily target complete' : remainingLabel,
    body: isTargetComplete
      ? 'You closed today\'s practice target. Start one new roleplay or review Progress while the feedback is still fresh.'
      : progress.targetSessionsRemaining === 1
        ? 'One more short roleplay will complete today\'s target.'
        : `${progress.targetSessionsRemaining} more short roleplays will complete today\'s target.`,
    todayValue: `${progress.targetSessionsCompleted}/${dailyTarget} done`,
    streakValue: `${progress.currentStreakDays} ${progress.currentStreakDays === 1 ? 'day' : 'days'}`,
  };
}

export function createSavedRoleplayMilestone({
  dailyTarget,
  savedSession,
  sessions,
  summary,
}: CreateSavedRoleplayMilestoneInput): SavedRoleplayMilestone {
  const previewSessions = sessions.some((session) => session.id === savedSession.id)
    ? sessions
    : [savedSession, ...sessions];
  const localProgress = createLocalProgressStats(summary, previewSessions, dailyTarget);
  const milestone = createPracticeCompletionMilestone({
    dailyTarget,
    progress: localProgress,
  });
  const roleplayLabel = dailyTarget === 1 ? 'roleplay' : 'roleplays';

  return {
    ...milestone,
    progressLabel: `${localProgress.targetSessionsCompleted}/${dailyTarget} ${roleplayLabel} today`,
    progressPercent: localProgress.targetCompletionPercent,
  };
}

export function createSavedRoleplayPathProgress({
  roleplays,
  savedSession,
  sessions,
}: CreateSavedRoleplayPathProgressInput): SavedRoleplayPathProgress | null {
  if (roleplays.length === 0) {
    return null;
  }

  const previewSessions = sessions.some((session) => session.id === savedSession.id)
    ? sessions
    : [savedSession, ...sessions];
  const path = createPracticeCareerPath({
    roleplays,
    sessions: previewSessions,
  });
  const nextStep = path.steps.find((step) => step.state === 'active') ?? path.steps[0];

  return {
    badgeLabel: path.meta,
    isPathComplete: path.progressPercent === 100,
    nextLabel: path.progressPercent === 100 ? 'Replay ready' : 'Unlocked next',
    nextTitle: nextStep?.title ?? path.title,
    progressLabel: path.progressLabel,
    progressPercent: path.progressPercent,
    roleplayId: nextStep?.roleplayId ?? path.roleplayId,
    title: path.title,
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
