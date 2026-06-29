export type FoundationSentenceBuilderState = {
  activePart: string | null;
  activePiece: string | null;
  helperLabel: string;
  helperText: string;
  isComplete: boolean;
  progressLabel: string;
  progressPercent: number;
  previewSegments: FoundationSentencePreviewSegment[];
  previewText: string;
  slots: FoundationSentenceBuilderSlot[];
  totalSteps: number;
};

export type FoundationSentenceBuilderSlot = {
  isCurrent: boolean;
  isDone: boolean;
  part: string;
  statusLabel: string;
};

export type FoundationSentencePreviewSegment = {
  state: 'done' | 'current' | 'locked';
  text: string;
};

type CreateFoundationSentenceBuilderStateInput = {
  completedSteps: number;
  exampleParts: readonly string[];
  structure: readonly string[];
};

export function createFoundationSentenceBuilderState({
  completedSteps,
  exampleParts,
  structure,
}: CreateFoundationSentenceBuilderStateInput): FoundationSentenceBuilderState {
  const totalSteps = Math.min(structure.length, exampleParts.length);
  const safeCompletedSteps = clamp(completedSteps, 0, totalSteps);
  const isComplete = safeCompletedSteps >= totalSteps;
  const activeStepIndex = isComplete ? totalSteps - 1 : safeCompletedSteps;
  const activePart = totalSteps > 0 && !isComplete ? structure[activeStepIndex] : null;
  const activePiece = totalSteps > 0 && !isComplete ? exampleParts[activeStepIndex] : null;
  const previewSegments = structure.slice(0, totalSteps).map((part, index) => {
    const isDone = index < safeCompletedSteps;
    const isCurrent = !isComplete && index === safeCompletedSteps;

    return {
      state: isDone ? 'done' : isCurrent ? 'current' : 'locked',
      text: isDone ? exampleParts[index] : part,
    } satisfies FoundationSentencePreviewSegment;
  });

  return {
    activePart,
    activePiece,
    helperLabel: isComplete ? 'Sentence ready' : `Next: ${activePart}`,
    helperText: isComplete
      ? 'Use this exact shape in your first career answer.'
      : `Tap to add: "${activePiece}"`,
    isComplete,
    progressLabel: `${safeCompletedSteps}/${totalSteps} parts built`,
    progressPercent: totalSteps === 0 ? 0 : Math.round((safeCompletedSteps / totalSteps) * 100),
    previewSegments,
    previewText: previewSegments
      .map((segment) => (segment.state === 'done' ? segment.text : `[${segment.text}]`))
      .join(' '),
    slots: structure.slice(0, totalSteps).map((part, index) => ({
      isCurrent: !isComplete && index === safeCompletedSteps,
      isDone: index < safeCompletedSteps,
      part,
      statusLabel:
        index < safeCompletedSteps ? 'Done' : !isComplete && index === safeCompletedSteps ? 'Tap' : 'Next',
    })),
    totalSteps,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
