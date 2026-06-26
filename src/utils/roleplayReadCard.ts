import type { RoleplayPromptVariant, RoleplayScenario } from '../types';

type RoleplayReadCardInput = {
  activePromptVariant?: RoleplayPromptVariant;
  roleplay: RoleplayScenario;
};

export function createRoleplayReadCard({
  activePromptVariant,
  roleplay,
}: RoleplayReadCardInput) {
  const context = roleplay.workplaceContext;
  const goal = activePromptVariant?.userGoal ?? roleplay.userGoal;

  return {
    context,
    description: roleplay.description,
    details: [
      {
        label: 'Situation',
        text: context,
      },
      {
        label: 'Goal',
        text: goal,
      },
    ],
    eyebrow: 'Read this first',
    focus: roleplay.focus,
    goal,
    openingLabel: `${roleplay.aiPersona} says`,
    openingLine: activePromptVariant?.openingLine ?? roleplay.openingLine,
  };
}
