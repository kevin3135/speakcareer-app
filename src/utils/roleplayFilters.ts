import type { RoleplayScenario } from '../types';

export const ALL_LEVELS_FILTER = 'All';

export type RoleplayLevelFilter = typeof ALL_LEVELS_FILTER | string;

export function getRoleplayLevelFilters(roleplays: RoleplayScenario[]) {
  const levels = roleplays.map((roleplay) => roleplay.targetLevel);

  return [ALL_LEVELS_FILTER, ...Array.from(new Set(levels))];
}

export function filterRoleplaysByLevel(
  roleplays: RoleplayScenario[],
  selectedLevel: RoleplayLevelFilter,
) {
  if (selectedLevel === ALL_LEVELS_FILTER) {
    return roleplays;
  }

  return roleplays.filter((roleplay) => roleplay.targetLevel === selectedLevel);
}
