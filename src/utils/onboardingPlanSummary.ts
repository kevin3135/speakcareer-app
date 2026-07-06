import type { OnboardingPlanPreview } from './onboardingPlan';

export type OnboardingPlanSummary = {
  body: string;
  detailsBody: string;
  detailsLabel: string;
  milestoneBadgeLabel: string;
  milestoneTitle: string;
  pathTitle: string;
};

type CreateOnboardingPlanSummaryInput = Pick<
  OnboardingPlanPreview,
  'dailyTargetLabel' | 'firstSaveMilestone' | 'nextQuestTitleShort' | 'steps'
>;

export function createOnboardingPlanSummary({
  dailyTargetLabel,
  firstSaveMilestone,
  nextQuestTitleShort,
  steps,
}: CreateOnboardingPlanSummaryInput): OnboardingPlanSummary {
  const firstStepTitle = steps[0]?.title ?? 'Lesson 1';
  const afterSaveLabel = firstSaveMilestone.badgeLabel.replace(/^After save\s+/i, '');
  const body = firstSaveMilestone.progressPercent === 100
    ? `First save starts your streak, opens Progress, and completes ${dailyTargetLabel}.`
    : `First save starts your streak, opens Progress, and moves you to ${afterSaveLabel} today.`;

  return {
    body,
    detailsBody: 'Daily pace, practice loop, and starter answer.',
    detailsLabel: 'See full first week',
    milestoneBadgeLabel: firstSaveMilestone.badgeLabel,
    milestoneTitle: firstSaveMilestone.title,
    pathTitle: `${firstStepTitle} -> ${nextQuestTitleShort}`,
  };
}
