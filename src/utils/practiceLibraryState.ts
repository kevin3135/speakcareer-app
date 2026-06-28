import type { PracticeSession, RoleplayId, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';

type PracticeLibraryRoleplay = Pick<
  RoleplayScenario,
  'category' | 'description' | 'durationMinutes' | 'focus' | 'id' | 'targetLevel' | 'title'
>;

export type PracticeLibraryCard = {
  categoryLabel: string;
  ctaLabel: string;
  description: string;
  difficulty: string;
  focus: string;
  id: string;
  roleplayId: RoleplayId;
  time: string;
  title: string;
  xp: string;
};

export type PracticeLibraryState = {
  browseCards: PracticeLibraryCard[];
  browseLabel: string;
  meta: string;
  progressLabel: string;
  progressPercent: number;
  recommendedCard: PracticeLibraryCard;
  subtitle: string;
  title: string;
};

type CreatePracticeLibraryStateInput = {
  roleplays: PracticeLibraryRoleplay[];
  sessions: Pick<PracticeSession, 'roleplayId'>[];
};

export function createPracticeLibraryState({
  roleplays,
  sessions,
}: CreatePracticeLibraryStateInput): PracticeLibraryState {
  const path = createPracticeCareerPath({ roleplays, sessions });
  const cardMap = new Map(
    roleplays.map((roleplay) => [roleplay.id, createBaseCard(roleplay)]),
  );
  const activeStep = path.steps.find((step) => step.state === 'active') ?? path.steps[0];
  const recommendedCard = activeStep
    ? createMappedCard(activeStep.roleplayId, cardMap, activeStep.state)
    : createFallbackCard();
  const browseCards = path.steps
    .filter((step) => step.roleplayId !== recommendedCard.roleplayId)
    .map((step) => createMappedCard(step.roleplayId, cardMap, step.state));

  return {
    browseCards,
    browseLabel: browseCards.length === 1 ? '1 more roleplay' : `${browseCards.length} more roleplays`,
    meta: path.meta,
    progressLabel: path.progressLabel,
    progressPercent: path.progressPercent,
    recommendedCard,
    subtitle: path.body,
    title: path.title,
  };
}

function createMappedCard(
  roleplayId: RoleplayId,
  cardMap: Map<RoleplayId, PracticeLibraryCard>,
  state: 'done' | 'active' | 'locked',
): PracticeLibraryCard {
  const baseCard = cardMap.get(roleplayId) ?? createFallbackCard(roleplayId);

  return {
    ...baseCard,
    categoryLabel: createCategoryLabel(state),
    ctaLabel: createCtaLabel(state),
  };
}

function createBaseCard(roleplay: PracticeLibraryRoleplay): PracticeLibraryCard {
  return {
    categoryLabel: 'Later',
    ctaLabel: 'Open anyway',
    description: roleplay.description,
    difficulty: roleplay.targetLevel,
    focus: roleplay.focus,
    id: roleplay.id,
    roleplayId: roleplay.id,
    time: `${roleplay.durationMinutes} min`,
    title: roleplay.title,
    xp: `+${roleplay.durationMinutes * 4} XP`,
  };
}

function createFallbackCard(roleplayId: RoleplayId = 'job-interview'): PracticeLibraryCard {
  return {
    categoryLabel: 'Next',
    ctaLabel: 'Start now',
    description: 'Practice one short professional English roleplay.',
    difficulty: 'B1-B2',
    focus: 'Build clear workplace answers',
    id: roleplayId,
    roleplayId,
    time: '5 min',
    title: 'Job Interview',
    xp: '+20 XP',
  };
}

function createCategoryLabel(state: 'done' | 'active' | 'locked') {
  if (state === 'active') {
    return 'Next';
  }

  if (state === 'done') {
    return 'Completed';
  }

  return 'Later';
}

function createCtaLabel(state: 'done' | 'active' | 'locked') {
  if (state === 'active') {
    return 'Start now';
  }

  if (state === 'done') {
    return 'Practice again';
  }

  return 'Open anyway';
}
