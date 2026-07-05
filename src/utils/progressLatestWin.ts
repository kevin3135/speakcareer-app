import type { PracticeSession } from '../types';

export type ProgressLatestWinState = {
  badgeLabel: string;
  body: string;
  coachBadgeLabel: string;
  coachLabel: string;
  coachText: string;
  eyebrow: string;
  recapLabel: string;
  recapText: string;
};

type CreateProgressLatestWinStateInput = {
  isDailyTargetComplete: boolean;
  session: Pick<
    PracticeSession,
    | 'feedbackSummary'
    | 'includedFollowUp'
    | 'nextFocusLabel'
    | 'nextFocusText'
    | 'readinessLabel'
    | 'roleplayTitle'
    | 'wordCount'
  >;
};

export function createProgressLatestWinState({
  isDailyTargetComplete,
  session,
}: CreateProgressLatestWinStateInput): ProgressLatestWinState {
  const coachText = session.nextFocusText?.trim() || session.feedbackSummary.trim();
  const hasCoachFocus = coachText === session.nextFocusText?.trim();

  return {
    badgeLabel: createBadgeLabel(session),
    body: createBody({
      isDailyTargetComplete,
      roleplayTitle: session.roleplayTitle,
      includedFollowUp: session.includedFollowUp,
      wordCount: session.wordCount,
    }),
    coachBadgeLabel: hasCoachFocus
      ? session.nextFocusLabel?.trim() || 'Coach target'
      : session.readinessLabel,
    coachLabel: hasCoachFocus ? 'Keep this correction' : 'Coach recap',
    coachText,
    eyebrow: isDailyTargetComplete ? 'Review this win first' : 'Saved today',
    recapLabel: 'Why it counts',
    recapText: createRecapText(session),
  };
}

function createBadgeLabel(
  session: Pick<PracticeSession, 'includedFollowUp' | 'wordCount'>,
) {
  if (session.includedFollowUp) {
    return 'Follow-up saved';
  }

  if (session.wordCount >= 35) {
    return 'Strong short answer';
  }

  return 'Core answer saved';
}

function createBody({
  isDailyTargetComplete,
  roleplayTitle,
  includedFollowUp,
  wordCount,
}: {
  includedFollowUp: boolean;
  isDailyTargetComplete: boolean;
  roleplayTitle: string;
  wordCount: number;
}) {
  if (isDailyTargetComplete) {
    if (includedFollowUp) {
      return `You finished today's target with a realistic two-turn ${roleplayTitle} rep. Keep the correction below, then stop or do one bonus sprint later.`;
    }

    return `You finished today's target with one saved ${roleplayTitle} answer. Keep the correction below, then stop or do one bonus sprint later.`;
  }

  if (includedFollowUp) {
    return 'You saved the main answer and the follow-up together. Keep the correction below, then carry that stronger second turn into your next sprint.';
  }

  if (wordCount >= 35) {
    return 'You banked enough detail to sound useful at work. Keep the correction below, then use it again in your next sprint.';
  }

  return 'You banked a clear first rep. Keep the correction below, then build on it in your next sprint.';
}

function createRecapText(
  session: Pick<PracticeSession, 'includedFollowUp' | 'wordCount'>,
) {
  if (session.includedFollowUp) {
    return 'Two saved turns feel closer to a real workplace conversation.';
  }

  if (session.wordCount >= 35) {
    return 'This answer had enough detail to count as a real practice win, not just a placeholder line.';
  }

  return 'Short saved answers still grow your streak, XP and coach history.';
}
