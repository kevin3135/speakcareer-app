import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Screen } from '../components/Screen';
import { foundationStart, guidedStart } from '../data/guidedIntro';
import { colors, radii, spacing, typography } from '../styles/theme';

type FoundationScreenProps = {
  onStartCareerPractice: () => void;
};

export function FoundationScreen({ onStartCareerPractice }: FoundationScreenProps) {
  return (
    <Screen
      title="Lesson 1"
      subtitle="Build the sentence first. Then use it in a work situation."
    >
      <View style={styles.stage}>
        <Text style={styles.kicker}>Basic structure</Text>
        <Text style={styles.title}>I + action + result</Text>

        <View style={styles.structureRow}>
          {foundationStart.structure.map((part) => (
            <View key={part} style={styles.structureBlock}>
              <Text style={styles.structureText}>{part}</Text>
            </View>
          ))}
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Say it like this</Text>
          <Text style={styles.exampleText}>{foundationStart.example}</Text>
        </View>

        <View style={styles.ruleBox}>
          <Text style={styles.ruleTitle}>Your rule</Text>
          <Text style={styles.ruleText}>Say who did it, what happened, and why it mattered.</Text>
        </View>

        <View style={styles.buttonRow}>
          <AppButton
            accessibilityHint={`Uses this sentence structure in ${guidedStart.title}`}
            label="Use this in Job Interview"
            onPress={onStartCareerPractice}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  kicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  structureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  structureBlock: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: '#A9DCCF',
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 70,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  structureText: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  exampleCard: {
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  exampleLabel: {
    color: colors.accentSoft,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  exampleText: {
    color: colors.surface,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  ruleBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  ruleTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  ruleText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  buttonRow: {
    marginTop: spacing.lg,
  },
});
