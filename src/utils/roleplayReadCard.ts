import type { RoleplayPromptVariant, RoleplayScenario } from '../types';

type RoleplayReadCardInput = {
  activePromptVariant?: RoleplayPromptVariant;
  roleplay: RoleplayScenario;
};

export function createRoleplayReadCard({
  activePromptVariant,
  roleplay,
}: RoleplayReadCardInput) {
  return {
    context: roleplay.workplaceContext,
    contextLabel: 'Context',
    description: roleplay.description,
    eyebrow: 'Read this first',
    focus: roleplay.focus,
    goal: activePromptVariant?.userGoal ?? roleplay.userGoal,
    goalLabel: 'Your goal',
    openingLabel: `${roleplay.aiPersona} says`,
    openingLine: activePromptVariant?.openingLine ?? roleplay.openingLine,
  };
}
