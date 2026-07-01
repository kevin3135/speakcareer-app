import type { PracticeCareerPath, PracticeCareerPathStep } from './practiceCareerPath';

export type PracticeRunwayItem = {
  id: string;
  metaLabel: string;
  sequenceLabel: string;
  state: PracticeCareerPathStep['state'];
  statusLabel: string;
  title: string;
  xpLabel: string;
};

export type PracticeRunwayState = {
  body: string;
  eyebrow: string;
  items: PracticeRunwayItem[];
  progressLabel: string;
  title: string;
};

const MAX_VISIBLE_ITEMS = 3;

export function createPracticeRunway(path: PracticeCareerPath): PracticeRunwayState | null {
  if (path.steps.length === 0) {
    return null;
  }

  const activeIndex = Math.max(0, path.steps.findIndex((step) => step.state === 'active'));
  const visibleSteps = getVisibleSteps(path.steps, activeIndex);
  const nextUnlockStep = path.steps.find((step) => step.state === 'locked') ?? null;
  const activeStep = path.steps[activeIndex] ?? path.steps[0];
  const isPathComplete = path.progressPercent === 100;

  return {
    body: createRunwayBody({
      activeStep,
      isPathComplete,
      nextUnlockStep,
    }),
    eyebrow: 'What unlocks next',
    items: visibleSteps.map(({ index, step }) => ({
      id: step.id,
      metaLabel: step.caption,
      sequenceLabel: String(index + 1).padStart(2, '0'),
      state: step.state,
      statusLabel: createStatusLabel(step, activeIndex, index, isPathComplete),
      title: step.title,
      xpLabel: step.xpLabel,
    })),
    progressLabel: path.progressLabel,
    title: isPathComplete ? 'Full path complete' : `After ${activeStep.title}`,
  };
}

function getVisibleSteps(steps: PracticeCareerPathStep[], activeIndex: number) {
  const tentativeStart = Math.max(0, activeIndex - 1);
  const tentativeEnd = Math.min(steps.length, tentativeStart + MAX_VISIBLE_ITEMS);
  const start = Math.max(0, tentativeEnd - MAX_VISIBLE_ITEMS);

  return steps.slice(start, tentativeEnd).map((step, offset) => ({
    index: start + offset,
    step,
  }));
}

function createStatusLabel(
  step: PracticeCareerPathStep,
  activeIndex: number,
  stepIndex: number,
  isPathComplete: boolean,
) {
  if (step.state === 'done') {
    return 'Done';
  }

  if (step.state === 'active') {
    return isPathComplete ? 'Replay now' : 'Do now';
  }

  return stepIndex === activeIndex + 1 ? 'Unlock next' : 'Later';
}

function createRunwayBody({
  activeStep,
  isPathComplete,
  nextUnlockStep,
}: {
  activeStep: PracticeCareerPathStep;
  isPathComplete: boolean;
  nextUnlockStep: PracticeCareerPathStep | null;
}) {
  if (isPathComplete) {
    return `You cleared the full English path. Replay ${activeStep.title} to keep the streak moving without opening the full library first.`;
  }

  if (!nextUnlockStep) {
    return `Finish ${activeStep.title} now to keep the guided path moving.`;
  }

  return `Save ${activeStep.title} now to unlock ${nextUnlockStep.title} and keep Practice app-led instead of browse-led.`;
}
