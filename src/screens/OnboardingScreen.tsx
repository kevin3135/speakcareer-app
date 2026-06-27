import { useState } from 'react';
import type { DimensionValue } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { foundationStart, levelAssessment, type LevelAssessmentChoice } from '../data/guidedIntro';
import { colors, radii, spacing, typography } from '../styles/theme';

type OnboardingScreenProps = {
  onContinue: () => void;
};

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<LevelAssessmentChoice['id'] | null>(null);
  const progressWidth = `${levelAssessment.progressPercent}%` as DimensionValue;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.coachRow}>
        <View style={styles.coachBadge}>
          <Text style={styles.coachInitials}>SC</Text>
        </View>
        <View style={styles.speechBubble}>
          <Text style={styles.question}>{levelAssessment.question}</Text>
        </View>
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
        <Text style={styles.foundationHint}>{foundationStart.title}</Text>
        <AppButton
          accessibilityHint="Continues to the first guided English foundation lesson"
          disabled={!selectedLevelId}
          label="Continue"
          onPress={onContinue}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101C22',
    flexGrow: 1,
    padding: spacing.xl,
  },
  progressTrack: {
    backgroundColor: '#35444D',
    borderRadius: 999,
    height: 16,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#92E044',
    borderRadius: 999,
    height: 16,
  },
  coachRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.xxl,
  },
  coachBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    borderBottomWidth: 5,
    borderRadius: radii.md,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  coachInitials: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  speechBubble: {
    borderColor: '#34454F',
    borderRadius: radii.md,
    borderWidth: 2,
    flex: 1,
    marginLeft: spacing.lg,
    padding: spacing.lg,
  },
  question: {
    color: colors.surface,
    fontSize: typography.h2,
    fontWeight: '800',
    lineHeight: 28,
  },
  optionList: {
    marginTop: spacing.xxl,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: '#12232B',
    borderColor: '#34454F',
    borderRadius: radii.md,
    borderWidth: 2,
    flexDirection: 'row',
    marginBottom: spacing.md,
    minHeight: 118,
    padding: spacing.lg,
  },
  optionCardSelected: {
    borderColor: '#92E044',
    backgroundColor: '#172D26',
  },
  optionCardPressed: {
    opacity: 0.86,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: '#22323A',
    borderRadius: radii.md,
    height: 58,
    justifyContent: 'center',
    width: 68,
  },
  levelBadgeSelected: {
    backgroundColor: '#92E044',
  },
  levelBadgeText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '900',
  },
  levelBadgeTextSelected: {
    color: '#102019',
  },
  optionCopy: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  optionTitle: {
    color: colors.surface,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: 22,
  },
  optionBody: {
    color: '#B7C4CB',
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xxl,
  },
  foundationHint: {
    color: '#B7C4CB',
    fontSize: typography.small,
    fontWeight: '800',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
