import type { MistakeItem, RoleplayId } from '../types';

type RoleplayLink = {
  match: string;
  roleplayId: RoleplayId;
  roleplayTitle: string;
};

export type MistakePracticeDrill = {
  body: string;
  ctaLabel: string;
  eyebrow: string;
  mistake: MistakeItem;
  roleplayId: RoleplayId;
  steps: string[];
  title: string;
};

export type MistakePracticeStatus = {
  body: string;
  ctaLabel: string;
  label: string;
};

const PRIORITY_ORDER: Record<MistakeItem['priority'], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const ROLEPLAY_LINKS: RoleplayLink[] = [
  { match: 'interview', roleplayId: 'job-interview', roleplayTitle: 'Job Interview' },
  { match: 'meeting', roleplayId: 'meeting-practice', roleplayTitle: 'Meeting Practice' },
  { match: 'presentation', roleplayId: 'presentation-practice', roleplayTitle: 'Presentation Practice' },
  { match: 'sales', roleplayId: 'sales-call', roleplayTitle: 'Sales Call' },
  { match: 'small talk', roleplayId: 'workplace-small-talk', roleplayTitle: 'Workplace Small Talk' },
];

export function createMistakePracticeDrill(
  mistakes: MistakeItem[],
  practicedMistakeIds: string[] = [],
): MistakePracticeDrill | null {
  if (mistakes.length === 0) {
    return null;
  }

  const practicedMistakeIdSet = new Set(practicedMistakeIds);
  const prioritizedMistakes = [...mistakes].sort(
    (left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority],
  );
  const mistake = prioritizedMistakes.find(
    (item) => !practicedMistakeIdSet.has(item.id),
  ) ?? prioritizedMistakes[0];
  const roleplayLink = getRoleplayLink(mistake.category);

  return {
    body: `Train this pattern before your next ${roleplayLink.roleplayTitle} sprint.`,
    ctaLabel: `Practice ${roleplayLink.roleplayTitle}`,
    eyebrow: `${mistake.priority} priority`,
    mistake,
    roleplayId: roleplayLink.roleplayId,
    steps: [
      'Read the better sentence once.',
      'Say it out loud without looking at the original.',
      'Use the same pattern in your next answer.',
    ],
    title: `Practice this correction: ${mistake.category}`,
  };
}

export function createMistakePracticeStatus(isPracticed: boolean): MistakePracticeStatus {
  if (isPracticed) {
    return {
      body: 'Nice. Use this same pattern in one short roleplay sprint while it is fresh.',
      ctaLabel: 'Practiced once',
      label: 'Practice win',
    };
  }

  return {
    body: 'Say the better sentence out loud once, then mark it as practiced.',
    ctaLabel: 'Mark practiced',
    label: 'Ready to repeat',
  };
}

function getRoleplayLink(category: string): RoleplayLink {
  const normalizedCategory = category.toLowerCase();

  return (
    ROLEPLAY_LINKS.find((link) => normalizedCategory.includes(link.match)) ??
    ROLEPLAY_LINKS[0]
  );
}
