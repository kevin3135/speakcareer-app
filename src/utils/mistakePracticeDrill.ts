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

export function createMistakePracticeDrill(mistakes: MistakeItem[]): MistakePracticeDrill | null {
  if (mistakes.length === 0) {
    return null;
  }

  const mistake = [...mistakes].sort(
    (left, right) => PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority],
  )[0];
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

function getRoleplayLink(category: string): RoleplayLink {
  const normalizedCategory = category.toLowerCase();

  return (
    ROLEPLAY_LINKS.find((link) => normalizedCategory.includes(link.match)) ??
    ROLEPLAY_LINKS[0]
  );
}
