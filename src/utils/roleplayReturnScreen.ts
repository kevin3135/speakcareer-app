import type { MainScreen } from '../types';

type ResolveRoleplayReturnScreenInput = {
  currentScreen: MainScreen;
  existingReturnScreen: Exclude<MainScreen, 'Roleplay'>;
};

export function resolveRoleplayReturnScreen({
  currentScreen,
  existingReturnScreen,
}: ResolveRoleplayReturnScreenInput): Exclude<MainScreen, 'Roleplay'> {
  if (currentScreen === 'Roleplay') {
    return existingReturnScreen;
  }

  return currentScreen;
}

export function createRoleplayBackLabel(
  returnScreen: Exclude<MainScreen, 'Roleplay'>,
) {
  const labels: Record<Exclude<MainScreen, 'Roleplay'>, string> = {
    Foundation: 'Back to Lesson 1',
    Home: 'Back to Learn',
    Practice: 'Back to Practice',
    Profile: 'Back to Me',
    Progress: 'Back to Wins',
  };

  return labels[returnScreen];
}
