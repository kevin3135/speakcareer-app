type RoleplayPhraseHelperInput = {
  isOpen: boolean;
  phraseCount: number;
};

export type RoleplayPhraseHelperState = {
  helperText: string;
  summaryLabel: string;
  toggleAccessibilityLabel: string;
  toggleLabel: string;
};

export function createRoleplayPhraseHelperState({
  isOpen,
  phraseCount,
}: RoleplayPhraseHelperInput): RoleplayPhraseHelperState {
  const safePhraseCount = Math.max(phraseCount, 0);
  const phraseLabel = safePhraseCount === 1 ? '1 phrase' : `${safePhraseCount} phrases`;

  if (isOpen) {
    return {
      helperText: 'Use one short phrase if it fits your natural answer.',
      summaryLabel: phraseLabel,
      toggleAccessibilityLabel: 'Hide helpful phrases',
      toggleLabel: 'Hide',
    };
  }

  return {
    helperText: 'Open a few optional phrases if you want help starting.',
    summaryLabel: phraseLabel,
    toggleAccessibilityLabel: 'Show helpful phrases',
    toggleLabel: 'Show',
  };
}
