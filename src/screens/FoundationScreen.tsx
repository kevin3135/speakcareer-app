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
import type { DailyPracticeTarget, StartingLevelId } from '../types';
import { createFoundationHandoff } from '../utils/foundationHandoff';
import { createFoundationSentenceBuilderState } from '../utils/foundationSentenceBuilder';
import { getStartingLevelProfile } from '../utils/startingLevel';

type FoundationScreenProps = {
  dailyTarget: DailyPracticeTarget;
  initialCompletedSteps: number;
  onBack: () => void;
  onProgressChange: (completedSteps: number) => void;
  onStartCareerPractice: () => void;
  startingLevelId: StartingLevelId;
};

export function FoundationScreen({
  dailyTarget,
  initialCompletedSteps,
  onBack,
  onProgressChange,
  onStartCareerPractice,
  startingLevelId,
}: FoundationScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(initialCompletedSteps);
  const levelProfile = getStartingLevelProfile(startingLevelId);
  const builderState = createFoundationSentenceBuilderState({
    completedSteps,
    exampleParts: levelProfile.foundationExampleParts,
    structure: foundationStart.structure,
  });
  const totalSteps = builderState.totalSteps;
  const isComplete = builderState.isComplete;
  const activePart = builderState.activePart;
  const activePiece = builderState.activePiece;
  const handoff = createFoundationHandoff({
    coachNote: levelProfile.coachMessage,
    dailyTarget,
    nextQuestTitle: guidedStart.title,
    starterAnswer: levelProfile.starterAnswer,
    starterEditSteps: levelProfile.starterEditSteps,
  });
  const continueLabel = isComplete ? 'Continue to interview' : `Tap ${activePart} first`;

  function selectStructurePart(index: number) {
    if (index === completedSteps) {
      setCompletedSteps((steps) => {
        const nextSteps = Math.min(steps + 1, totalSteps);
        onProgressChange(nextSteps);

        return nextSteps;
      });
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

        <View style={styles.sentenceRail}>
          {builderState.slots.map((slot) => (
            <View
              key={slot.part}
              style={[
                styles.sentenceSlot,
                slot.isDone && styles.sentenceSlotDone,
                slot.isCurrent && styles.sentenceSlotCurrent,
              ]}
            >
              <Text
                style={[
                  styles.sentenceSlotLabel,
                  slot.isDone && styles.sentenceSlotLabelDone,
                  slot.isCurrent && styles.sentenceSlotLabelCurrent,
                ]}
              >
                {slot.part}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.sentenceSlotText,
                  slot.isDone && styles.sentenceSlotTextDone,
                  slot.isCurrent && styles.sentenceSlotTextCurrent,
                ]}
              >
                {slot.statusLabel}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.previewBox, isComplete && styles.previewBoxComplete]}>
          <View style={styles.previewHeader}>
            <Text style={[styles.previewLabel, isComplete && styles.previewLabelComplete]}>
              Sentence build
            </Text>
            <Badge
              label={builderState.progressLabel}
              tone={isComplete ? 'success' : 'info'}
            />
          </View>
          <View style={styles.previewSentenceWrap}>
            {builderState.previewSegments.map((segment, index) => (
              <View
                key={`${segment.text}-${index}`}
                style={[
                  styles.previewToken,
                  segment.state === 'done' && styles.previewTokenDone,
                  segment.state === 'current' && styles.previewTokenCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.previewTokenText,
                    segment.state === 'done' && styles.previewTokenTextDone,
                    segment.state === 'current' && styles.previewTokenTextCurrent,
                  ]}
                >
                  {segment.state === 'done' ? segment.text : `[${segment.text}]`}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.previewHint}>
            <Text style={styles.previewHintLabel}>{builderState.helperLabel}. </Text>
            {builderState.helperText}
          </Text>
        </View>

        {isComplete ? (
          <View style={styles.finishedBlock}>
            <Text style={styles.finishedLabel}>Built and ready</Text>
            <Text style={styles.finishedSentence}>Use this same shape in Job Interview next.</Text>
          </View>
        ) : (
          <Pressable
            accessibilityHint="Adds this part to the example sentence"
            accessibilityLabel={`Add ${activePart}`}
            accessibilityRole="button"
            onPress={() => selectStructurePart(completedSteps)}
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
          <ProgressBar value={builderState.progressPercent} tone="secondary" />
        </View>
      </Card>

      {isComplete ? (
        <Card tone="accent">
          <View style={styles.handoffHeader}>
            <Text style={styles.handoffKicker}>{handoff.eyebrow}</Text>
            <Badge label="Quest 1" tone="accent" />
          </View>
          <Text style={styles.handoffTitle}>{handoff.title}</Text>
          <Text style={styles.handoffBody}>{handoff.body}</Text>
          <View style={styles.handoffPathBox}>
            <Text style={styles.handoffPathLabel}>{handoff.pathLabel}</Text>
            <View style={styles.handoffPathList}>
              {handoff.pathSteps.map((step, index) => (
                <View key={step.badgeLabel} style={styles.handoffPathStep}>
                  <View style={styles.handoffPathStepHeader}>
                    <Badge label={step.badgeLabel} tone={index === 0 ? 'accent' : 'success'} />
                    <Text style={styles.handoffPathStepTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.handoffPathStepDetail}>{step.detail}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.handoffStarterKit}>
            <View style={styles.handoffStarterHeader}>
              <Text style={styles.handoffExampleLabel}>{handoff.starterLabel}</Text>
              <Badge label={handoff.editPlanLabel} tone="secondary" />
            </View>
            <Text numberOfLines={2} style={styles.handoffExampleText}>
              {handoff.starterAnswer}
            </Text>
            <View style={styles.handoffEditList}>
              {handoff.editPlanSteps.map((step, index) => (
                <View key={`${index + 1}-${step}`} style={styles.handoffEditStep}>
                  <Text style={styles.handoffEditStepNumber}>{index + 1}</Text>
                  <Text style={styles.handoffEditStepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text numberOfLines={2} style={styles.handoffCoachNote}>
            {handoff.coachNote}
          </Text>
        </Card>
      ) : null}

      <AppButton
        accessibilityHint={`Uses this sentence structure in ${guidedStart.title}`}
        disabled={!isComplete}
        label={continueLabel}
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
  sentenceRail: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  previewBox: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  previewBoxComplete: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  previewLabelComplete: {
    color: colors.successDark,
  },
  previewSentenceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  previewToken: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewTokenCurrent: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  previewTokenDone: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
  },
  previewTokenText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
  },
  previewTokenTextCurrent: {
    color: colors.primaryDark,
  },
  previewTokenTextDone: {
    color: colors.ink,
  },
  previewHint: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
  previewHintLabel: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  sentenceSlot: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    padding: spacing.sm,
  },
  sentenceSlotCurrent: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  sentenceSlotDone: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
  },
  sentenceSlotLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  sentenceSlotLabelCurrent: {
    color: colors.primaryDark,
  },
  sentenceSlotLabelDone: {
    color: colors.secondaryDark,
  },
  sentenceSlotText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sentenceSlotTextCurrent: {
    color: colors.primaryDark,
  },
  sentenceSlotTextDone: {
    color: colors.ink,
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
  handoffPathBox: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  handoffPathLabel: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  handoffPathList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  handoffPathStep: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  handoffPathStepHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  handoffPathStepTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  handoffPathStepDetail: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  handoffStarterKit: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  handoffStarterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  handoffExampleLabel: {
    color: colors.accentDark,
    flex: 1,
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
  handoffEditList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  handoffEditStep: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  handoffEditStepNumber: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    width: 12,
  },
  handoffEditStepText: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  handoffCoachNote: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
});
