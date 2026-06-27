import type { PracticeSession, RoleplayId } from '../types';

export const PRACTICE_SESSIONS_KEY = 'speakcareer:practice-sessions';
export const MAX_STORED_PRACTICE_SESSIONS = 10;

export type PracticeSessionStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

type UnknownRecord = Record<string, unknown>;

export function normalizePracticeSessions(value: unknown): PracticeSession[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizePracticeSession(item))
    .filter((session): session is PracticeSession => Boolean(session))
    .slice(0, MAX_STORED_PRACTICE_SESSIONS);
}

export async function readPracticeSessions(storage: PracticeSessionStorage): Promise<PracticeSession[]> {
  try {
    const storedValue = await storage.getItem(PRACTICE_SESSIONS_KEY);

    return normalizePracticeSessions(storedValue ? JSON.parse(storedValue) : []);
  } catch {
    return [];
  }
}

export async function savePracticeSessions(
  storage: PracticeSessionStorage,
  sessions: PracticeSession[],
): Promise<void> {
  const safeSessions = normalizePracticeSessions(sessions);

  await storage.setItem(PRACTICE_SESSIONS_KEY, JSON.stringify(safeSessions));
}

function normalizePracticeSession(item: unknown): PracticeSession | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const record = item as UnknownRecord;
  const session = {
    answerPreview: asString(record.answerPreview),
    completedAt: asString(record.completedAt),
    feedbackSummary: asString(record.feedbackSummary),
    id: asString(record.id),
    includedFollowUp: asBoolean(record.includedFollowUp),
    readinessLabel: asString(record.readinessLabel),
    roleplayId: asString(record.roleplayId) as RoleplayId,
    roleplayTitle: asString(record.roleplayTitle),
    wordCount: asNumber(record.wordCount),
    xpReward: asNumber(record.xpReward),
  };

  if (
    !session.id ||
    !session.roleplayId ||
    !session.roleplayTitle ||
    !session.completedAt ||
    !session.answerPreview ||
    !session.readinessLabel ||
    !session.feedbackSummary
  ) {
    return null;
  }

  return session;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}
