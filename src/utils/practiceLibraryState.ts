import type { PracticeSession, RoleplayDraft, RoleplayId, RoleplayScenario } from '../types';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeCareerPath } from './practiceCareerPath.ts';
// @ts-expect-error Node test imports require the explicit .ts extension here.
import { createPracticeRunway, type PracticeRunwayState } from './practiceRunway.ts';
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

export type PracticeRecommendedPayoffState = {
  badgeLabel: string;
  body: string;
  eyebrow: string;
  iconLabel: string;
  progressLabel: string;
  title: string;
};

export type PracticeLibraryState = {
  browseCards: PracticeLibraryCard[];
  browseLabel: string;
  closedPreview: {
    body: string;
    eyebrow: string;
    previewTitles: string[];
    title: string;
  };
  isResumeMode: boolean;
  meta: string;
  progressLabel: string;
  progressPercent: number;
  recommendedCard: PracticeLibraryCard;
  recommendedPayoff: PracticeRecommendedPayoffState;
  runway: PracticeRunwayState | null;
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
  const nextLockedStep = activeStep ? getNextLockedStep(path.steps, activeStep.id) : null;
  const savedDraftRoleplay = draft
    ? roleplays.find((roleplay) => roleplay.id === draft.roleplayId) ?? null
    : null;
  const recommendedCard = savedDraftRoleplay && draft
    ? createSavedDraftCard(savedDraftRoleplay, draft)
    : activeStep
    ? createMappedCard(activeStep.roleplayId, cardMap, activeStep.state, nextLockedStep?.title)
    : createFallbackCard();
  const browseCards = path.steps
    .filter((step) => step.roleplayId !== recommendedCard.roleplayId)
    .map((step) => createMappedCard(step.roleplayId, cardMap, step.state));
  const draftReview = draft ? summarizePracticeAnswer(draft.draftAnswer) : null;
  const isResumeMode = Boolean(savedDraftRoleplay && draftReview);
  const closedPreview = createClosedPreview(browseCards, isResumeMode);
  const recommendedPayoff = createRecommendedPayoff({
    isResumeMode,
    nextLockedStep,
    progressLabel: path.progressLabel,
    progressPercent: path.progressPercent,
    recommendedTitle: recommendedCard.title,
  });

  return {
    browseCards,
    browseLabel: browseCards.length === 1 ? '1 more roleplay' : `${browseCards.length} more roleplays`,
    closedPreview,
    isResumeMode,
    meta: isResumeMode ? 'Saved draft' : path.meta,
    progressLabel: path.progressLabel,
    progressPercent: path.progressPercent,
    recommendedCard,
    recommendedPayoff,
    runway: isResumeMode ? null : createPracticeRunway(path),
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
  nextLockedStepTitle?: string | null,
): PracticeLibraryCard {
  const baseCard = cardMap.get(roleplayId) ?? createFallbackCard(roleplayId);
  const activeCardCopy = state === 'active'
    ? createActiveRecommendedCardCopy(nextLockedStepTitle)
    : null;

  return {
    ...baseCard,
    categoryLabel: createCategoryLabel(state),
    ctaLabel: createCtaLabel(state),
    description: activeCardCopy?.description ?? baseCard.description,
    focus: activeCardCopy?.focus ?? baseCard.focus,
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

  return {
    ...createBaseCard(roleplay),
    categoryLabel: 'Resume',
    ctaLabel: 'Finish now',
    description: createSavedDraftDescription(review),
    focus: createSavedDraftFocus(review),
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

function getNextLockedStep(
  steps: { id: string; state: 'done' | 'active' | 'locked'; title: string }[],
  activeStepId: string,
) {
  const activeIndex = steps.findIndex((step) => step.id === activeStepId);
  const laterLockedStepIndex = steps
    .slice(activeIndex + 1)
    .findIndex((step) => step.state === 'locked');

  if (laterLockedStepIndex === -1) {
    return null;
  }

  const stepIndex = activeIndex + 1 + laterLockedStepIndex;
  const step = steps[stepIndex];

  return {
    sequenceLabel: String(stepIndex + 1).padStart(2, '0'),
    title: step.title,
  };
}

function createRecommendedPayoff({
  isResumeMode,
  nextLockedStep,
  progressLabel,
  progressPercent,
  recommendedTitle,
}: {
  isResumeMode: boolean;
  nextLockedStep: { sequenceLabel: string; title: string } | null;
  progressLabel: string;
  progressPercent: number;
  recommendedTitle: string;
}) {
  if (isResumeMode) {
    return {
      badgeLabel: 'Draft first',
      body: 'Check the saved answer, save XP, then return to the guided path.',
      eyebrow: 'Stay focused',
      iconLabel: 'GO',
      progressLabel: 'Draft waiting',
      title: 'Finish this answer first',
    };
  }

  if (nextLockedStep) {
    return {
      badgeLabel: 'After save',
      body: `Save ${recommendedTitle}, then ${nextLockedStep.title} becomes the next guided sprint.`,
      eyebrow: 'Next unlock',
      iconLabel: nextLockedStep.sequenceLabel,
      progressLabel,
      title: `${nextLockedStep.title} unlocks`,
    };
  }

  return {
    badgeLabel: progressPercent >= 100 ? 'Path ready' : 'After save',
    body: `Save ${recommendedTitle} for XP and keep your career English streak moving.`,
    eyebrow: progressPercent >= 100 ? 'Keep momentum' : 'Next win',
    iconLabel: 'XP',
    progressLabel,
    title: progressPercent >= 100 ? 'Full path ready' : 'Save this sprint',
  };
}

function createActiveRecommendedCardCopy(nextLockedStepTitle?: string | null) {
  if (nextLockedStepTitle) {
    return {
      description: 'Check it, earn XP, then open the next career step.',
      focus: `Next sprint: save one answer to unlock ${nextLockedStepTitle}.`,
    };
  }

  return {
    description: 'Check it, earn XP, then keep your streak moving.',
    focus: 'Next sprint: save one sharp answer for today.',
  };
}

function createSavedDraftSubtitle(roleplayTitle: string, wordCount: number) {
  const wordLabel = `${wordCount} ${wordCount === 1 ? 'word' : 'words'}`;

  return `Saved ${wordLabel} for ${roleplayTitle}. Finish it first.`;
}

function createSavedDraftDescription(review: ReturnType<typeof summarizePracticeAnswer>) {
  const wordLabel = `${review.wordCount} ${review.wordCount === 1 ? 'word' : 'words'} saved`;

  if (review.wordCount === 0) {
    return 'Open this draft and write one first line before browsing.';
  }

  if (!review.isReadyForFeedback) {
    return `${wordLabel}. Add detail, then check.`;
  }

  return `${wordLabel}. Check it, save XP, then unlock the next step.`;
}

function createSavedDraftFocus(review: ReturnType<typeof summarizePracticeAnswer>) {
  if (review.wordCount === 0) {
    return 'Resume sprint: write one clear work action.';
  }

  if (!review.isReadyForFeedback) {
    return 'Resume sprint: add one concrete work example.';
  }

  if (review.readinessLabel === 'Good start') {
    return 'Resume sprint: add one result or next step.';
  }

  return 'Resume sprint: review clarity, then save.';
}

function createClosedPreview(browseCards: PracticeLibraryCard[], isResumeMode: boolean) {
  const count = browseCards.length;
  const previewTitles = browseCards.slice(0, 3).map((card) => card.title);

  return {
    body: isResumeMode
      ? 'Stay with the saved draft first. Open the rest only if you want a different English rep.'
      : 'Stay with the recommended sprint first. Open the rest only if you want a different English rep.',
    eyebrow: 'Optional later',
    previewTitles,
    title: count === 1 ? '1 other roleplay stays hidden' : `${count} other roleplays stay hidden`,
  };
}
