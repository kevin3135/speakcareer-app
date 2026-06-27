import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  ProgressBar,
  ScreenContainer,
} from '../components/ui';
import { foundationStart, guidedStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { StartingLevelId } from '../types';
import { createFoundationHandoff } from '../utils/foundationHandoff';
import { getStartingLevelProfile } from '../utils/startingLevel';

type FoundationScreenProps = {
  onBack: () => void;
  onStartCareerPractice: () => void;
  startingLevelId: StartingLevelId;
};

export function FoundationScreen({ onBack, onStartCareerPractice, startingLevelId }: FoundationScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const totalSteps = foundationStart.structure.length;
  const isComplete = completedSteps >= totalSteps;
  const levelProfile = getStartingLevelProfile(startingLevelId);
  const sentencePieces = levelProfile.foundationExampleParts;
  const activeStepIndex = Math.min(completedSteps, totalSteps - 1);
  const activePart = foundationStart.structure[activeStepIndex];
  const activePiece = sentencePieces[activeStepIndex];
  const handoff = createFoundationHandoff({
    coachNote: levelProfile.coachMessage,
    nextQuestTitle: guidedStart.title,
    starterAnswer: levelProfile.starterAnswer,
  });
  const builtSentence =
    completedSteps > 0
      ? sentencePieces.slice(0, completedSteps).join(' ')
      : '';

  function selectStructurePart(index: number) {
    if (index === completedSteps) {
      setCompletedSteps((steps) => Math.min(steps + 1, totalSteps));
    }
  }

  return (
    <ScreenContainer
      overline="Lesson 1"
      subtitle="Learn one structure before career roleplay."
      title="Clear sentence"
    >
      <Pressable
        accessibilityHint="Go back to Learn"
        accessibilityLabel="Back to Learn"
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.structureBlockPressed]}
      >
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Card tone="strong">
        <View style={styles.stepHeader}>
          <Badge label={`Step ${Math.min(completedSteps + 1, totalSteps)} of ${totalSteps}`} tone="secondary" />
          <Text style={styles.stepTitle}>{isComplete ? 'Sentence ready' : `Tap: ${activePart}`}</Text>
        </View>

        {isComplete ? (
          <View style={styles.finishedBlock}>
            <Text style={styles.finishedLabel}>You built</Text>
            <Text style={styles.finishedSentence}>{levelProfile.foundationExample}</Text>
          </View>
        ) : (
          <Pressable
            accessibilityHint="Adds this part to the example sentence"
            accessibilityLabel={`Add ${activePart}`}
            accessibilityRole="button"
            onPress={() => selectStructurePart(activeStepIndex)}
            style={({ pressed }) => [
              styles.singleStepButton,
              pressed && styles.structureBlockPressed,
            ]}
          >
            <Text style={styles.singleStepPart}>{activePart}</Text>
            <Text style={styles.singleStepPiece}>{activePiece}</Text>
          </Pressable>
        )}

        <View style={styles.progressCard}>
          <ProgressBar value={(completedSteps / totalSteps) * 100} tone="secondary" />
        </View>
      </Card>

      {!isComplete && builtSentence ? (
        <View style={styles.previewSentence}>
          <Text style={styles.previewSentenceText}>{builtSentence}</Text>
        </View>
      ) : null}

      {isComplete ? (
        <Card tone="accent">
          <View style={styles.handoffHeader}>
            <Text style={styles.handoffKicker}>{handoff.eyebrow}</Text>
            <Badge label="Quest 1" tone="accent" />
          </View>
          <Text style={styles.handoffTitle}>{handoff.title}</Text>
          <Text style={styles.handoffBody}>{handoff.body}</Text>
          <View style={styles.handoffExampleBox}>
            <Text style={styles.handoffExampleLabel}>{handoff.starterLabel}</Text>
            <Text numberOfLines={2} style={styles.handoffExampleText}>
              {handoff.starterAnswer}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.handoffCoachNote}>
            {handoff.coachNote}
          </Text>
        </Card>
      ) : null}

      <AppButton
        accessibilityHint={`Uses this sentence structure in ${guidedStart.title}`}
        disabled={!isComplete}
        label={isComplete ? 'Continue to interview' : 'Tap the 3 blocks first'}
        onPress={onStartCareerPractice}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  structureBlockPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  backText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  stepHeader: {
    gap: spacing.md,
  },
  stepTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: typography.lineH1,
  },
  singleStepButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 178,
    padding: spacing.xl,
  },
  singleStepPart: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.hero,
    fontWeight: '900',
  },
  singleStepPiece: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  progressCard: {
    marginTop: spacing.lg,
  },
  finishedBlock: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  finishedLabel: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  finishedSentence: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  previewSentence: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  previewSentenceText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  handoffHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handoffKicker: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  handoffTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.sm,
  },
  handoffBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  handoffExampleBox: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  handoffExampleLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  handoffExampleText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  handoffCoachNote: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
});
