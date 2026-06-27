import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  CoachBubble,
  GradientHero,
  ScreenContainer,
  SectionHeader,
} from '../components/ui';
import { foundationStart, guidedStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';

type FoundationScreenProps = {
  onStartCareerPractice: () => void;
};

export function FoundationScreen({ onStartCareerPractice }: FoundationScreenProps) {
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

      <CoachBubble
        message="This is the basic shape. First say who did it, then the action, then the result."
      />

      <View style={styles.structureRow}>
        {foundationStart.structure.map((part, index) => (
          <View key={part} style={styles.structureBlock}>
            <Text style={styles.structureNumber}>{index + 1}</Text>
            <Text style={styles.structureText}>{part}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Copy this example" />
      <View style={styles.exampleCard}>
        <Text style={styles.exampleText}>{foundationStart.example}</Text>
      </View>

      <View style={styles.ruleBox}>
        <Text style={styles.ruleTitle}>Your rule</Text>
        <Text style={styles.ruleText}>Say who did it, what happened, and why it mattered.</Text>
      </View>

      <AppButton
        accessibilityHint={`Uses this sentence structure in ${guidedStart.title}`}
        label="Continue to interview"
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
