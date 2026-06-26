export const FOCUS_SESSION_SECONDS = 5 * 60;

export type FocusTimerControls = {
  caption: string;
  description: string;
  primaryAccessibilityLabel: string;
  primaryLabel: string;
  resetAccessibilityLabel: string;
  resetLabel: string;
  showReset: boolean;
  title: string;
};

export function formatFocusTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

type FocusTimerControlsInput = {
  isRunning: boolean;
  secondsRemaining: number;
};

export function createFocusTimerControls({
  isRunning,
  secondsRemaining,
}: FocusTimerControlsInput): FocusTimerControls {
  const isFinished = secondsRemaining <= 0;
  const hasStarted = isRunning || secondsRemaining < FOCUS_SESSION_SECONDS;

  return {
    caption: isRunning ? 'Sprint running' : isFinished ? 'Sprint complete' : '5-minute sprint',
    description: 'Use this only when you want a focused 5-minute sprint.',
    primaryAccessibilityLabel: isRunning
      ? 'Pause focus timer'
      : isFinished
        ? 'Restart focus timer'
        : 'Start focus timer',
    primaryLabel: isRunning ? 'Pause' : isFinished ? 'Restart' : 'Start',
    resetAccessibilityLabel: 'Reset focus timer',
    resetLabel: 'Reset',
    showReset: hasStarted,
    title: 'Optional timer',
  };
}
