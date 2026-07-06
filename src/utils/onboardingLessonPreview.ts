export type OnboardingLessonPreviewPart = {
  label: string;
  value: string;
};

export type OnboardingLessonPreview = {
  badgeLabel: string;
  body: string;
  exampleSentence: string;
  parts: OnboardingLessonPreviewPart[];
  title: string;
};

type CreateOnboardingLessonPreviewInput = {
  exampleParts: readonly string[];
  nextQuestTitle: string;
  structure: readonly string[];
};

export function createOnboardingLessonPreview({
  exampleParts,
  nextQuestTitle,
  structure,
}: CreateOnboardingLessonPreviewInput): OnboardingLessonPreview {
  const totalParts = Math.min(structure.length, exampleParts.length);
  const nextQuestTitleShort = nextQuestTitle.replace(/^Quest \d+:\s*/, '');
  const parts = structure.slice(0, totalParts).map((label, index) => ({
    label,
    value: exampleParts[index],
  }));

  return {
    badgeLabel: `${totalParts} ${totalParts === 1 ? 'tap' : 'taps'}`,
    body: `Tap these parts in Lesson 1, then use the same shape in ${nextQuestTitleShort}.`,
    exampleSentence: parts.map((part) => part.value).join(' ').replace(/\s+/g, ' ').trim(),
    parts,
    title: parts.map((part) => part.label).join(' -> '),
  };
}
