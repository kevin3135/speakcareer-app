import type { RoleplayPromptVariant } from '../types';

type RoleplayAnglePickerInput = {
  activeVariantId: string | null;
  isOpen: boolean;
  variants: RoleplayPromptVariant[];
};

type RoleplayAngleOption = {
  isRecommendedNext: boolean;
  metaLabel: string;
  variant: RoleplayPromptVariant;
};

export function createRoleplayAnglePickerState({
  activeVariantId,
  isOpen,
  variants,
}: RoleplayAnglePickerInput) {
  const activeIndex = variants.findIndex((variant) => variant.id === activeVariantId);
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;
  const currentAngle =
    variants.find((variant) => variant.id === activeVariantId) ?? variants[0];
  const nextAngle =
    currentAngle && variants.length > 1
      ? variants[(currentIndex + 1) % variants.length]
      : null;
  const options: RoleplayAngleOption[] = currentAngle
    ? variants
        .filter((variant) => variant.id !== currentAngle.id)
        .map((variant, index) => {
          const variantIndex = variants.findIndex((item) => item.id === variant.id);
          const isRecommendedNext = nextAngle?.id === variant.id;

          return {
            isRecommendedNext,
            metaLabel: isRecommendedNext
              ? 'Recommended next'
              : `Option ${variantIndex + 1 || index + 1} of ${variants.length}`,
            variant,
          };
        })
    : [];
  const progressLabel = currentAngle ? `${currentIndex + 1} of ${variants.length}` : '0 of 0';
  const nextAngleTitle = nextAngle?.title ?? null;

  return {
    closedGuidance: nextAngleTitle
      ? `Next recommended: ${nextAngleTitle}`
      : 'One focused practice angle for this scenario.',
    currentAngle,
    eyebrow: 'Practice angle',
    helperText: nextAngleTitle
      ? `If you are unsure, choose "${nextAngleTitle}" next. It keeps practice moving one step at a time.`
      : 'Stay with this angle and finish one short answer.',
    nextAngleTitle,
    options,
    progressLabel,
    showHelperText: isOpen,
    toggleAccessibilityLabel: isOpen ? 'Hide practice angle choices' : 'Change practice angle',
    toggleLabel: isOpen ? 'Hide' : 'Change',
  };
}
