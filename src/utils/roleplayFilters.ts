import type { RoleplayCategory, RoleplayScenario } from '../types';

export const ALL_LEVELS_FILTER = 'All';
export const ALL_CATEGORIES_FILTER = 'All';

export type RoleplayLevelFilter = typeof ALL_LEVELS_FILTER | string;
export type RoleplayCategoryFilter = typeof ALL_CATEGORIES_FILTER | RoleplayCategory;

export function getRoleplayLevelFilters(roleplays: RoleplayScenario[]) {
  const levels = roleplays.map((roleplay) => roleplay.targetLevel);

  return [ALL_LEVELS_FILTER, ...Array.from(new Set(levels))];
}

export function getRoleplayCategoryFilters(
  roleplays: RoleplayScenario[],
): RoleplayCategoryFilter[] {
  const categories = roleplays.map((roleplay) => roleplay.category);

  return [ALL_CATEGORIES_FILTER, ...Array.from(new Set(categories))];
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

export function filterRoleplaysByCategory(
  roleplays: RoleplayScenario[],
  selectedCategory: RoleplayCategoryFilter,
) {
  if (selectedCategory === ALL_CATEGORIES_FILTER) {
    return roleplays;
  }

  return roleplays.filter((roleplay) => roleplay.category === selectedCategory);
}
