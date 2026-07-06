import type { PracticeSession } from '../types';

const MAX_HOME_COACH_FOCUS_LENGTH = 44;
const MAX_HOME_COACH_BADGE_LENGTH = 16;
const ACTION_START_PATTERN =
  /^(add|ask|avoid|connect|include|keep|lead|make|mention|name|replace|show|start|try|use)\b/i;

export function createHomeCoachFocusText(focusText?: string | null) {
  const normalized = focusText?.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return null;
  }

  const actionSentence = pickActionSentence(normalized);
  const quotedAction = createQuotedAction(actionSentence);

  if (quotedAction) {
    return quotedAction;
  }

  const compactAction = createCompactAction(actionSentence);

  if (compactAction) {
    return compactAction;
  }

  const simplifiedAction = simplifyAction(actionSentence);
  const prefixedAction = addNextPrefix(simplifiedAction);

  return ensurePeriod(truncateAtWord(prefixedAction, MAX_HOME_COACH_FOCUS_LENGTH));
}

export function createHomeCoachCue(
  session?: Pick<PracticeSession, 'feedbackSummary' | 'nextFocusLabel' | 'nextFocusText'> | null,
) {
  const text =
    createHomeCoachFocusText(session?.nextFocusText) ??
    createHomeCoachFocusText(session?.feedbackSummary);

  if (!text) {
    return null;
  }

  return {
    badgeLabel: createBadgeLabel(session?.nextFocusLabel),
    text,
  };
}

function pickActionSentence(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [text];

  return sentences.find((sentence) => ACTION_START_PATTERN.test(sentence)) ?? sentences[0];
}

function createQuotedAction(sentence: string) {
  const cleaned = sentence.trim().replace(/[.!?]+$/, '');
  const action = cleaned.match(ACTION_START_PATTERN)?.[1]?.toLowerCase();
  const quotedPhrase = cleaned.match(/\b(?:like|such as)\s+("[^"]+"(?:\s+or\s+"[^"]+")?)/i)?.[1];

  if (!action || !quotedPhrase || quotedPhrase.length > 28) {
    return null;
  }

  return ensurePeriod(`Next: ${action} ${quotedPhrase}`);
}

function createCompactAction(sentence: string) {
  const cleaned = sentence.trim().replace(/[.!?]+$/, '');

  if (/^use one stronger career verb/i.test(cleaned)) {
    return 'Next: use a stronger career verb.';
  }

  const colonIndex = cleaned.indexOf(':');

  if (colonIndex > 0 && colonIndex <= MAX_HOME_COACH_FOCUS_LENGTH - 8) {
    return ensurePeriod(addNextPrefix(cleaned.slice(0, colonIndex)));
  }

  return null;
}

function createBadgeLabel(label?: string) {
  const normalized = label?.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return 'Next focus';
  }

  if (normalized.length <= MAX_HOME_COACH_BADGE_LENGTH) {
    return normalized;
  }

  const areaLabel = ['Clarity', 'Confidence', 'Structure', 'Vocabulary'].find((area) =>
    new RegExp(area, 'i').test(normalized),
  );

  return areaLabel ?? 'Next focus';
}

function simplifyAction(sentence: string) {
  let cleaned = sentence.trim().replace(/[.!?]+$/, '');

  if (cleaned.length > MAX_HOME_COACH_FOCUS_LENGTH - 6) {
    cleaned = cleaned.replace(/\s+to\s+.+$/i, '');
  }

  if (cleaned.length > MAX_HOME_COACH_FOCUS_LENGTH - 6) {
    cleaned = cleaned.replace(/\s+or\s+[^,.;]+$/i, '');
  }

  return cleaned;
}

function addNextPrefix(text: string) {
  const trimmed = text.trim();

  if (/^next:/i.test(trimmed)) {
    return trimmed;
  }

  return `Next: ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

function truncateAtWord(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const compact = text.slice(0, maxLength - 3).trimEnd();
  const lastSpaceIndex = compact.lastIndexOf(' ');
  const truncated = lastSpaceIndex > 16 ? compact.slice(0, lastSpaceIndex) : compact;

  return `${truncated}...`;
}

function ensurePeriod(text: string) {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}
