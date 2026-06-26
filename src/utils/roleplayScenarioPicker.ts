import type { RoleplayId, RoleplayScenario } from '../types';

export type RoleplayScenarioPickerOption = Pick<
  RoleplayScenario,
  'category' | 'durationMinutes' | 'focus' | 'id' | 'targetLevel' | 'title'
>;

type RoleplayScenarioPickerInput = {
  activeRoleplayId: RoleplayId;
  isOpen: boolean;
  roleplays: RoleplayScenario[];
};

export function createRoleplayScenarioPickerState({
  activeRoleplayId,
  isOpen,
  roleplays,
}: RoleplayScenarioPickerInput) {
  const currentScenario =
    roleplays.find((item) => item.id === activeRoleplayId) ?? roleplays[0];
  const options = roleplays.filter((item) => item.id !== currentScenario.id);

  return {
    currentScenario,
    eyebrow: 'Current scenario',
    helperText: 'Stay with one scenario for this short sprint. Change only if another work situation matters today.',
    options,
    showHelperText: isOpen,
    toggleAccessibilityLabel: isOpen ? 'Hide roleplay scenario choices' : 'Change roleplay scenario',
    toggleLabel: isOpen ? 'Hide' : 'Change',
  };
}

export function formatRoleplayScenarioMeta(scenario: RoleplayScenarioPickerOption) {
  return `${scenario.targetLevel} / ${scenario.durationMinutes} min / ${scenario.category}`;
}
