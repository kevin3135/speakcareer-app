import type { RoleplayDraft, RoleplayId } from '../types';

export const ROLEPLAY_DRAFT_KEY = 'speakcareer:roleplay-draft';

const ROLEPLAY_IDS: RoleplayId[] = [
  'job-interview',
  'meeting-practice',
  'presentation-practice',
  'sales-call',
  'workplace-small-talk',
];

type UnknownRecord = Record<string, unknown>;

export type RoleplayDraftStorage = {
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function normalizeRoleplayDraft(value: unknown): RoleplayDraft | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as UnknownRecord;
  const draftAnswer = asString(record.draftAnswer).trim();
  const roleplayId = asRoleplayId(record.roleplayId);
  const updatedAt = asString(record.updatedAt);

  if (!draftAnswer || !roleplayId || !updatedAt) {
    return null;
  }

  return {
    draftAnswer,
    roleplayId,
    updatedAt,
  };
}

export async function readRoleplayDraft(storage: RoleplayDraftStorage): Promise<RoleplayDraft | null> {
  try {
    const storedValue = await storage.getItem(ROLEPLAY_DRAFT_KEY);

    return normalizeRoleplayDraft(storedValue ? JSON.parse(storedValue) : null);
  } catch {
    return null;
  }
}

export async function saveRoleplayDraft(
  storage: RoleplayDraftStorage,
  draft: RoleplayDraft | null,
): Promise<void> {
  const safeDraft = normalizeRoleplayDraft(draft);

  if (!safeDraft) {
    await storage.removeItem(ROLEPLAY_DRAFT_KEY);
    return;
  }

  await storage.setItem(ROLEPLAY_DRAFT_KEY, JSON.stringify(safeDraft));
}

export async function clearRoleplayDraft(storage: RoleplayDraftStorage): Promise<void> {
  await storage.removeItem(ROLEPLAY_DRAFT_KEY);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asRoleplayId(value: unknown): RoleplayId | null {
  return ROLEPLAY_IDS.find((roleplayId) => roleplayId === value) ?? null;
}
