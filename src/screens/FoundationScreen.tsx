import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  CoachBubble,
  GradientHero,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
} from '../components/ui';
import { foundationStart, guidedStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';

type FoundationScreenProps = {
  onStartCareerPractice: () => void;
};

const sentencePieces = ['I', 'helped the team finish', 'the project on time.'];

export function FoundationScreen({ onStartCareerPractice }: FoundationScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const totalSteps = foundationStart.structure.length;
  const isComplete = completedSteps >= totalSteps;
  const builtSentence =
    completedSteps > 0
      ? sentencePieces.slice(0, completedSteps).join(' ')
      : 'Tap the first block to build the sentence.';

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
      <GradientHero
        overline="Remember this"
        subtitle="Use this whenever you explain work experience."
        title="I + action + result"
        tone="secondary"
      />

      <CoachBubble message="Tap the blocks in order. Build the sentence, then continue to interview practice." />

      <View style={styles.structureRow}>
        {foundationStart.structure.map((part, index) => {
          const isDone = index < completedSteps;
          const isActive = index === completedSteps;

          return (
            <Pressable
              accessibilityHint={
                isActive
                  ? 'Adds this part to the example sentence'
                  : 'This part unlocks after the previous part'
              }
              accessibilityLabel={`Step ${index + 1}: ${part}`}
              accessibilityRole="button"
              disabled={!isActive}
              key={part}
              onPress={() => selectStructurePart(index)}
              style={({ pressed }) => [
                styles.structureBlock,
                isActive && styles.structureBlockActive,
                isDone && styles.structureBlockDone,
                pressed && styles.structureBlockPressed,
              ]}
            >
              <Text style={styles.structureNumber}>{index + 1}</Text>
              <Text style={[styles.structureText, isDone && styles.structureTextDone]}>{part}</Text>
              <Text style={[styles.structureStatus, isDone && styles.structureStatusDone]}>
                {isDone ? 'Added' : isActive ? 'Tap' : 'Next'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>Sentence progress</Text>
        <ProgressBar value={(completedSteps / totalSteps) * 100} tone="secondary" />
      </View>

      <SectionHeader title="Build this example" />
      <View style={styles.exampleCard}>
        <Text style={styles.exampleText}>{builtSentence}</Text>
      </View>

      <View style={styles.ruleBox}>
        <Text style={styles.ruleTitle}>Your rule</Text>
        <Text style={styles.ruleText}>Say who did it, what happened, and why it mattered.</Text>
      </View>

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
  structureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  structureBlock: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 92,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  structureBlockActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  structureBlockDone: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
  },
  structureBlockPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  structureNumber: {
    color: colors.accent,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  structureText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  structureTextDone: {
    color: colors.secondaryDark,
  },
  structureStatus: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  structureStatusDone: {
    color: colors.secondaryDark,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  progressLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  exampleCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  exampleText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
  },
  ruleBox: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  ruleTitle: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  ruleText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
});
