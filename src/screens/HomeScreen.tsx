import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Screen } from '../components/Screen';
import { foundationStart } from '../data/guidedIntro';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { PracticeSession } from '../types';

type HomeScreenProps = {
  onStartFoundation: () => void;
  sessions: PracticeSession[];
};

export function HomeScreen({ onStartFoundation, sessions }: HomeScreenProps) {
  const hasSavedPractice = sessions.length > 0;

  return (
    <Screen
      title="SpeakCareer"
      subtitle="The app will guide you. Start with the basic English structure first."
    >
      <View style={styles.lessonPanel}>
        <Text style={styles.kicker}>{hasSavedPractice ? 'Step 2 of 3' : 'Step 1 of 3'}</Text>
        <Text style={styles.title}>
          {hasSavedPractice ? 'Keep building clear English' : foundationStart.title}
        </Text>
        <Text style={styles.body}>
          {hasSavedPractice
            ? 'Use the same sentence shape again, then continue with career practice.'
            : foundationStart.subtitle}
        </Text>

        <View style={styles.formulaRow}>
          {foundationStart.structure.map((part, index) => (
            <View key={part} style={styles.formulaItem}>
              <Text style={styles.formulaNumber}>{index + 1}</Text>
              <Text style={styles.formulaText}>{part}</Text>
            </View>
          ))}
        </View>

        <View style={styles.exampleBlock}>
          <Text style={styles.exampleLabel}>Example</Text>
          <Text style={styles.exampleText}>{foundationStart.example}</Text>
        </View>

        <View style={styles.buttonRow}>
          <AppButton
            accessibilityHint="Opens the first language foundation lesson"
            label={foundationStart.ctaLabel}
            onPress={onStartFoundation}
          />
        </View>
      </View>

      <View style={styles.nextPanel}>
        <Text style={styles.nextLabel}>Next unlock</Text>
        <Text style={styles.nextTitle}>{foundationStart.nextLabel}</Text>
        <Text style={styles.nextBody}>
          After this structure, the app puts it inside a professional answer.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lessonPanel: {
    backgroundColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    borderBottomWidth: 5,
    borderRadius: radii.md,
    padding: spacing.xl,
  },
  kicker: {
    color: '#DFF3EC',
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  body: {
    color: '#F0FBF7',
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.md,
  },
  formulaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  formulaItem: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flex: 1,
    minHeight: 76,
    padding: spacing.md,
  },
  formulaNumber: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
  },
  formulaText: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  exampleBlock: {
    backgroundColor: colors.primaryDark,
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
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  buttonRow: {
    marginTop: spacing.lg,
  },
  nextPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  nextLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  nextTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  nextBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
