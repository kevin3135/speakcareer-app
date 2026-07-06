import type { PracticeSession } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { formatSessionDate } from './sessionHistory.ts';

export type ProgressRecentSessionItem = {
  id: string;
  metaLabel: string;
  nextFocusLabel: string;
  nextFocusText: string;
  replayLabel: string;
  roleplayId: PracticeSession['roleplayId'];
  roleplayTitle: string;
  xpLabel: string;
};

export type ProgressRecentSessionsState = {
  body: string;
  countLabel: string;
  footerLabel: string | null;
  eyebrow: string;
  items: ProgressRecentSessionItem[];
  title: string;
};

const MAX_VISIBLE_RECENT_SESSIONS = 3;

export function createProgressRecentSessions(
  sessions: PracticeSession[],
): ProgressRecentSessionsState | null {
  if (sessions.length <= 1) {
    return null;
  }

  const earlierSessions = sessions.slice(1);
  const visibleSessions = earlierSessions.slice(0, MAX_VISIBLE_RECENT_SESSIONS);
  const hiddenCount = Math.max(earlierSessions.length - visibleSessions.length, 0);
  const hasSingleEarlierSave = earlierSessions.length === 1;

  return {
    body: hasSingleEarlierSave
      ? 'Keep your first coaching target visible so the second save builds on a real correction.'
      : 'Keep one earlier coaching target visible so each new answer builds on real practice.',
    countLabel: `${visibleSessions.length} earlier save${visibleSessions.length === 1 ? '' : 's'}`,
    footerLabel: hiddenCount > 0 ? `${hiddenCount} older save${hiddenCount === 1 ? '' : 's'} still stored locally` : null,
    eyebrow: 'Recent saves',
    items: visibleSessions.map((session) => ({
      id: session.id,
      metaLabel: createMetaLabel(session),
      nextFocusLabel: session.nextFocusLabel?.trim() || 'Coach target',
      nextFocusText: session.nextFocusText?.trim() || session.feedbackSummary,
      replayLabel: 'Replay now',
      roleplayId: session.roleplayId,
      roleplayTitle: session.roleplayTitle,
      xpLabel: `+${session.xpReward} XP`,
    })),
    title: hasSingleEarlierSave ? 'Keep your first win in play' : 'Earlier wins still count',
  };
}

function createMetaLabel(session: PracticeSession) {
  const followUpLabel = session.includedFollowUp ? ' | Follow-up' : '';

  return `${formatSessionDate(session.completedAt)} | ${session.wordCount} words${followUpLabel}`;
}
