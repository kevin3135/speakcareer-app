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
  rewardRows: ProgressLatestWinRewardRow[];
};

export type ProgressLatestWinRewardRow = {
  label: string;
  value: string;
};

export type ProgressSpeakingFocusCue = {
  badgeLabel: string;
  eyebrow: string;
  metaText: string;
  text: string;
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
    | 'xpReward'
  >;
};

type CreateProgressSpeakingFocusCueInput = {
  isDailyTargetComplete: boolean;
  session: Pick<
    PracticeSession,
    | 'feedbackSummary'
    | 'nextFocusLabel'
    | 'nextFocusText'
    | 'roleplayTitle'
  >;
};

const MAX_SPEAKING_FOCUS_LENGTH = 72;
const ACTION_START_PATTERN =
  /^(add|ask|avoid|connect|include|keep|lead|make|mention|name|replace|show|start|try|use)\b/i;

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
    rewardRows: createRewardRows({ hasCoachFocus, isDailyTargetComplete, session }),
  };
}

export function createProgressSpeakingFocusCue({
  isDailyTargetComplete,
  session,
}: CreateProgressSpeakingFocusCueInput): ProgressSpeakingFocusCue | null {
  const focusText = session.nextFocusText?.trim() || session.feedbackSummary.trim();

  if (!focusText) {
    return null;
  }

  return {
    badgeLabel: createCoachCueBadgeLabel(session.nextFocusLabel),
    eyebrow: isDailyTargetComplete ? 'Review before bonus' : "Today's speaking focus",
    metaText: isDailyTargetComplete
      ? 'Repeat once, then stop or continue.'
      : `Use it in ${session.roleplayTitle}.`,
    text: createSpeakingFocusText(focusText),
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

function createRewardRows({
  hasCoachFocus,
  isDailyTargetComplete,
  session,
}: {
  hasCoachFocus: boolean;
  isDailyTargetComplete: boolean;
  session: Pick<PracticeSession, 'includedFollowUp' | 'wordCount' | 'xpReward'>;
}): ProgressLatestWinRewardRow[] {
  return [
    {
      label: 'Today',
      value: isDailyTargetComplete
        ? `Target complete, +${session.xpReward} XP`
        : `+${session.xpReward} XP banked`,
    },
    {
      label: 'Practice',
      value: session.includedFollowUp
        ? 'Two-turn workplace rep'
        : `${session.wordCount} words practiced`,
    },
    {
      label: 'Coach',
      value: hasCoachFocus ? 'Correction ready' : 'Recap saved',
    },
  ];
}

function createSpeakingFocusText(text: string) {
  const actionSentence = pickActionSentence(text).replace(/[.!?]+$/, '').trim();
  const normalizedAction = actionSentence.replace(/^next:\s*/i, '');

  if (!isActionSentence(actionSentence)) {
    return 'Next: repeat this correction once.';
  }

  const prefixedAction = /^next:/i.test(actionSentence)
    ? actionSentence
    : `Next: ${normalizedAction.charAt(0).toLowerCase()}${normalizedAction.slice(1)}`;

  return ensurePeriod(truncateAtWord(prefixedAction, MAX_SPEAKING_FOCUS_LENGTH));
}

function pickActionSentence(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [text.trim()];

  return sentences.find(isActionSentence) ?? sentences[0] ?? '';
}

function isActionSentence(sentence: string) {
  return ACTION_START_PATTERN.test(sentence.replace(/^next:\s*/i, '').trim());
}

function createCoachCueBadgeLabel(label?: string) {
  const normalized = label?.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return 'Coach cue';
  }

  if (normalized.length <= 18) {
    return normalized;
  }

  const areaLabel = ['Clarity', 'Confidence', 'Structure', 'Vocabulary'].find((area) =>
    new RegExp(area, 'i').test(normalized),
  );

  return areaLabel ?? 'Coach cue';
}

function truncateAtWord(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength - 1);
  const lastSpaceIndex = shortened.lastIndexOf(' ');

  if (lastSpaceIndex <= 0) {
    return shortened;
  }

  return shortened.slice(0, lastSpaceIndex);
}

function ensurePeriod(text: string) {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}
