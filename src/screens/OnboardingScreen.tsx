import { useState } from 'react';
import type { DimensionValue } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, Badge, CoachBubble, ProgressBar } from '../components/ui';
import {
  foundationStart,
  guidedStart,
  levelAssessment,
  type LevelAssessmentChoice,
} from '../data/guidedIntro';
import { colors, fonts, radius, shadows, spacing, typography } from '../theme';
import type { DailyPracticeTarget } from '../types';
import { createOnboardingPlanPreview } from '../utils/onboardingPlan';
import { getStartingLevelProfile } from '../utils/startingLevel';

type OnboardingScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onContinue: (
    selectedLevelId: LevelAssessmentChoice['id'],
    selectedDailyTarget: DailyPracticeTarget,
  ) => void;
};

const dailyTargetOptions: DailyPracticeTarget[] = [1, 2, 3];

export function OnboardingScreen({ dailyTarget, onContinue }: OnboardingScreenProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<LevelAssessmentChoice['id'] | null>(null);
  const [selectedDailyTarget, setSelectedDailyTarget] = useState<DailyPracticeTarget>(dailyTarget);
  const progressWidth = `${levelAssessment.progressPercent}%` as DimensionValue;
  const selectedChoice =
    levelAssessment.choices.find((choice) => choice.id === selectedLevelId) ?? null;
  const selectedProfile = selectedLevelId ? getStartingLevelProfile(selectedLevelId) : null;
  const planPreview =
    selectedChoice && selectedProfile
      ? createOnboardingPlanPreview({
          coachNote: selectedProfile.coachMessage,
          dailyTarget: selectedDailyTarget,
          firstLessonDetail: selectedProfile.foundationRule,
          firstLessonTitle: foundationStart.title,
          firstQuestSubtitle: guidedStart.subtitle,
          firstQuestTitle: guidedStart.title,
          levelLabel: selectedChoice.label,
          starterPrompt: selectedProfile.answerPlaceholder,
        })
      : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressShell}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <CoachBubble
        label="SpeakCareer coach"
        message="First I need your starting level. Then I will guide the first English step."
      />

      <View style={styles.hero}>
        <Text style={styles.kicker}>Start simple</Text>
        <Text style={styles.title}>{levelAssessment.question}</Text>
        <Text style={styles.subtitle}>No test pressure. Pick the card that feels closest today.</Text>
      </View>

      <View style={styles.optionList}>
        {levelAssessment.choices.map((choice) => {
          const isSelected = choice.id === selectedLevelId;

          return (
            <Pressable
              accessibilityHint="Selects your starting English level"
              accessibilityLabel={`${choice.title}. ${choice.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={choice.id}
              onPress={() => setSelectedLevelId(choice.id)}
              style={({ pressed }) => [
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                pressed && styles.optionCardPressed,
              ]}
            >
              <View style={[styles.levelBadge, isSelected && styles.levelBadgeSelected]}>
                <Text style={[styles.levelBadgeText, isSelected && styles.levelBadgeTextSelected]}>
                  {choice.label}
                </Text>
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{choice.title}</Text>
                <Text style={styles.optionBody}>{choice.body}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {planPreview ? (
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planCopy}>
              <Text style={styles.planKicker}>{planPreview.title}</Text>
              <Text style={styles.planTitle}>Start at {planPreview.levelLabel}</Text>
            </View>
            <Badge label={planPreview.dailyTargetLabel} tone="success" />
          </View>

          <Text numberOfLines={2} style={styles.planCoachNote}>
            {planPreview.coachNote}
          </Text>

          <View style={styles.targetCard}>
            <View style={styles.targetHeader}>
              <Text style={styles.targetLabel}>Daily rhythm</Text>
              <Text style={styles.targetTitle}>{planPreview.dailyTargetLabel}</Text>
            </View>
            <Text numberOfLines={1} style={styles.targetBody}>{planPreview.dailyTargetNote}</Text>
            <View style={styles.segmentedControl}>
              {dailyTargetOptions.map((target) => {
                const isActive = target === selectedDailyTarget;

                return (
                  <Pressable
                    accessibilityHint="Sets how many short roleplays you want each day"
                    accessibilityLabel={`Set onboarding daily target to ${target} ${target === 1 ? 'roleplay' : 'roleplays'}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    key={target}
                    onPress={() => setSelectedDailyTarget(target)}
                    style={({ pressed }) => [
                      styles.segment,
                      isActive && styles.segmentActive,
                      pressed && styles.segmentPressed,
                    ]}
                  >
                    <Text style={[styles.segmentValue, isActive && styles.segmentValueActive]}>
                      {target}/day
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.planPath}>
            <View style={styles.planPathBadge}>
              <Text style={styles.planPathBadgeText}>1</Text>
            </View>
            <View style={styles.planPathCopy}>
              <Text style={styles.planPathLabel}>Next path</Text>
              <Text numberOfLines={1} style={styles.planPathTitle}>
                {planPreview.steps[0].title} then {planPreview.nextQuestTitleShort}
              </Text>
              <Text numberOfLines={1} style={styles.planPathDetail}>
                {planPreview.steps[0].detail}
              </Text>
            </View>
          </View>

          <View style={styles.sessionLoopCard}>
            <View style={styles.sessionLoopHeader}>
              <Text style={styles.sessionLoopLabel}>{planPreview.sessionTitle}</Text>
              <Badge label={planPreview.sessionBadgeLabel} tone="info" />
            </View>
            <View style={styles.sessionLoopList}>
              {planPreview.sessionSteps.map((step, index) => {
                const isLastStep = index === planPreview.sessionSteps.length - 1;

                return (
                  <View key={step.label} style={styles.sessionLoopRow}>
                    <View style={styles.sessionLoopRail}>
                      <View style={styles.sessionLoopBadge}>
                        <Text style={styles.sessionLoopBadgeText}>{step.label}</Text>
                      </View>
                      {!isLastStep ? <View style={styles.sessionLoopLine} /> : null}
                    </View>
                    <View style={styles.sessionLoopCopy}>
                      <Text style={styles.sessionLoopTitle}>{step.title}</Text>
                      <Text style={styles.sessionLoopDetail}>{step.detail}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <Text style={styles.sessionLoopNote}>{planPreview.sessionNote}</Text>
          </View>

          <View style={styles.planStarter}>
            <Text style={styles.planStarterLabel}>First answer starter</Text>
            <Text numberOfLines={2} style={styles.planStarterText}>
              {planPreview.starterPrompt}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.foundationHint}>
          {planPreview ? planPreview.commitmentTitle : `Next: ${foundationStart.title}`}
        </Text>
        <ProgressBar value={levelAssessment.progressPercent} tone="accent" />
        {planPreview ? (
          <Text style={styles.foundationNote}>{planPreview.commitmentNote}</Text>
        ) : null}
        <View style={styles.footerButton}>
          <AppButton
            accessibilityHint={
              planPreview
                ? `Starts the ${planPreview.levelLabel} English path with the first guided lesson`
                : 'Continues to the first guided English foundation lesson'
            }
            disabled={!selectedLevelId}
            label={planPreview?.ctaLabel ?? 'Continue'}
            onPress={() => {
              if (selectedLevelId) {
                onContinue(selectedLevelId, selectedDailyTarget);
              }
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
  },
  progressShell: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  progressTrack: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 14,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 14,
  },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    marginTop: spacing.xl,
    padding: spacing.xl,
    ...shadows.medium,
  },
  kicker: {
    color: colors.accent,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  title: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.title,
    fontWeight: '900',
    lineHeight: typography.lineTitle,
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  optionList: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  planCard: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
    borderRadius: radius.xl,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  planHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  planCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  planKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  planTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  planCoachNote: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
  targetCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  targetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetLabel: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  targetTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginLeft: spacing.md,
    textAlign: 'right',
  },
  targetBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  segmentedControl: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.xs,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentPressed: {
    opacity: 0.82,
  },
  segmentValue: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  segmentValueActive: {
    color: colors.white,
  },
  planPath: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  planPathBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  planPathBadgeText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  planPathCopy: {
    flex: 1,
    marginLeft: spacing.md,
  },
  planPathLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  planPathTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  planPathDetail: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  planStarter: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  planStarterLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  planStarterText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  sessionLoopBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  sessionLoopBadgeText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  sessionLoopCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  sessionLoopCopy: {
    flex: 1,
    minWidth: 0,
  },
  sessionLoopDetail: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  sessionLoopHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionLoopLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  sessionLoopLine: {
    backgroundColor: colors.borderStrong,
    borderRadius: radius.pill,
    flex: 1,
    marginVertical: spacing.xs,
    width: 2,
  },
  sessionLoopList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  sessionLoopNote: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  sessionLoopRail: {
    alignItems: 'center',
    alignSelf: 'stretch',
    width: 28,
  },
  sessionLoopRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sessionLoopTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 112,
    padding: spacing.lg,
    ...shadows.soft,
  },
  optionCardSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  optionCardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    height: 58,
    justifyContent: 'center',
    width: 72,
  },
  levelBadgeSelected: {
    backgroundColor: colors.primary,
  },
  levelBadgeText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  levelBadgeTextSelected: {
    color: colors.white,
  },
  optionCopy: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  optionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
  },
  optionBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xxl,
  },
  foundationHint: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  foundationNote: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  footerButton: {
    marginTop: spacing.md,
  },
});
