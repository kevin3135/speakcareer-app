import type { RoleplayPromptVariant } from '../types';

type RoleplayAnglePickerInput = {
  activeVariantId: string | null;
  isOpen: boolean;
  variants: RoleplayPromptVariant[];
};

export function createRoleplayAnglePickerState({
  activeVariantId,
  isOpen,
  variants,
}: RoleplayAnglePickerInput) {
  const currentAngle =
    variants.find((variant) => variant.id === activeVariantId) ?? variants[0];
  const options = currentAngle
    ? variants.filter((variant) => variant.id !== currentAngle.id)
    : [];

  return {
    currentAngle,
    eyebrow: 'Practice angle',
    helperText: 'Start with this angle first. Change only if you want a different version of the same scenario.',
    options,
    toggleAccessibilityLabel: isOpen ? 'Hide practice angle choices' : 'Change practice angle',
    toggleLabel: isOpen ? 'Hide' : 'Change',
  };
}
