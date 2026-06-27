import { useState } from 'react';
import type { DimensionValue } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton, CoachBubble, ProgressBar } from '../components/ui';
import { foundationStart, levelAssessment, type LevelAssessmentChoice } from '../data/guidedIntro';
import { colors, fonts, radius, shadows, spacing, typography } from '../theme';

type OnboardingScreenProps = {
  onContinue: () => void;
};

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<LevelAssessmentChoice['id'] | null>(null);
  const progressWidth = `${levelAssessment.progressPercent}%` as DimensionValue;

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

      <View style={styles.footer}>
        <Text style={styles.foundationHint}>Next: {foundationStart.title}</Text>
        <ProgressBar value={levelAssessment.progressPercent} tone="accent" />
        <View style={styles.footerButton}>
          <AppButton
            accessibilityHint="Continues to the first guided English foundation lesson"
            disabled={!selectedLevelId}
            label="Continue"
            onPress={onContinue}
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
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  footerButton: {
    marginTop: spacing.md,
  },
});
