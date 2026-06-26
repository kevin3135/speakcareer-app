export const ONBOARDING_COMPLETED_KEY = 'speakcareer:onboarding-completed';
const ONBOARDING_COMPLETED_VALUE = 'true';

export type OnboardingStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export function isOnboardingCompletedValue(value: string | null): boolean {
  return value === ONBOARDING_COMPLETED_VALUE;
}

export async function readOnboardingCompletion(storage: OnboardingStorage): Promise<boolean> {
  try {
    return isOnboardingCompletedValue(await storage.getItem(ONBOARDING_COMPLETED_KEY));
  } catch {
    return false;
  }
}

export async function saveOnboardingCompletion(storage: OnboardingStorage): Promise<void> {
  await storage.setItem(ONBOARDING_COMPLETED_KEY, ONBOARDING_COMPLETED_VALUE);
}
