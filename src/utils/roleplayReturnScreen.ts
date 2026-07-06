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
