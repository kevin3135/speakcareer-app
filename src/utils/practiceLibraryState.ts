import type { PracticeSession, RoleplayDraft, RoleplayId, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { summarizePracticeAnswer } from './answerReview.ts';

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
  isResumeMode: boolean;
  meta: string;
  progressLabel: string;
  progressPercent: number;
  recommendedCard: PracticeLibraryCard;
  subtitle: string;
  title: string;
};

type CreatePracticeLibraryStateInput = {
  draft?: RoleplayDraft | null;
  roleplays: PracticeLibraryRoleplay[];
  sessions: Pick<PracticeSession, 'roleplayId'>[];
};

export function createPracticeLibraryState({
  draft,
  roleplays,
  sessions,
}: CreatePracticeLibraryStateInput): PracticeLibraryState {
  const path = createPracticeCareerPath({ roleplays, sessions });
  const cardMap = new Map(
    roleplays.map((roleplay) => [roleplay.id, createBaseCard(roleplay)]),
  );
  const activeStep = path.steps.find((step) => step.state === 'active') ?? path.steps[0];
  const savedDraftRoleplay = draft
    ? roleplays.find((roleplay) => roleplay.id === draft.roleplayId) ?? null
    : null;
  const recommendedCard = savedDraftRoleplay && draft
    ? createSavedDraftCard(savedDraftRoleplay, draft)
    : activeStep
    ? createMappedCard(activeStep.roleplayId, cardMap, activeStep.state)
    : createFallbackCard();
  const browseCards = path.steps
    .filter((step) => step.roleplayId !== recommendedCard.roleplayId)
    .map((step) => createMappedCard(step.roleplayId, cardMap, step.state));
  const draftReview = draft ? summarizePracticeAnswer(draft.draftAnswer) : null;
  const isResumeMode = Boolean(savedDraftRoleplay && draftReview);

  return {
    browseCards,
    browseLabel: browseCards.length === 1 ? '1 more roleplay' : `${browseCards.length} more roleplays`,
    isResumeMode,
    meta: isResumeMode ? 'Saved draft' : path.meta,
    progressLabel: path.progressLabel,
    progressPercent: path.progressPercent,
    recommendedCard,
    subtitle: isResumeMode && savedDraftRoleplay && draftReview
      ? createSavedDraftSubtitle(savedDraftRoleplay.title, draftReview.wordCount)
      : path.body,
    title: isResumeMode && savedDraftRoleplay ? `Resume ${savedDraftRoleplay.title}` : path.title,
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

function createSavedDraftCard(
  roleplay: PracticeLibraryRoleplay,
  draft: RoleplayDraft,
): PracticeLibraryCard {
  const review = summarizePracticeAnswer(draft.draftAnswer);
  const wordLabel = `${review.wordCount} ${review.wordCount === 1 ? 'word' : 'words'} saved`;

  return {
    ...createBaseCard(roleplay),
    categoryLabel: 'Resume',
    ctaLabel: 'Finish now',
    description: createSavedDraftDescription(review),
    focus: `${review.readinessLabel} | ${wordLabel}`,
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

function createSavedDraftSubtitle(roleplayTitle: string, wordCount: number) {
  const wordLabel = `${wordCount} ${wordCount === 1 ? 'word' : 'words'}`;

  return `Your saved ${roleplayTitle} answer is waiting with ${wordLabel}. Finish it before switching to another conversation.`;
}

function createSavedDraftDescription(review: ReturnType<typeof summarizePracticeAnswer>) {
  if (review.wordCount === 0) {
    return 'You saved this roleplay on this device. Start the answer here before browsing the rest of the library.';
  }

  if (!review.isReadyForFeedback) {
    return `${review.wordCount} words are already saved. ${review.reviewNote} Then check the answer.`;
  }

  return `${review.wordCount} words are already saved. ${review.reviewNote} Finish and save it before switching practice.`;
}
