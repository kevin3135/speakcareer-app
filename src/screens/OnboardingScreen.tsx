import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { guidedIntroSteps, guidedStart } from '../data/guidedIntro';
import { practiceContent } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';

type OnboardingScreenProps = {
  onContinue: () => void;
};

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandBlock}>
        <Text style={styles.kicker}>English career practice</Text>
        <Text style={styles.brand}>SpeakCareer</Text>
        <Text style={styles.positioning}>Your first 5-minute English practice is ready.</Text>
        <Text style={styles.intro}>
          Start with one Job Interview answer. Read the prompt, write 2-4 sentences and review a clearer version.
        </Text>
      </View>

      <View style={styles.firstPracticeCard}>
        <Card muted>
          <Text style={styles.cardKicker}>First guided practice</Text>
          <Text style={styles.cardTitle}>{guidedStart.title}</Text>
          <Text style={styles.body}>{guidedStart.subtitle}</Text>
          <View style={styles.detailRow}>
            {guidedStart.detailLabels.map((label) => (
              <View key={label} style={styles.detailPill}>
                <Text style={styles.detailPillText}>{label}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.stepsBlock}>
        {guidedIntroSteps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={[styles.stepNumber, stepAccentStyles[index]]}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepTextBlock}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          accessibilityHint="Moves from onboarding to the Home screen"
          label={guidedStart.ctaLabel}
          onPress={onContinue}
        />
        <Text style={styles.note}>
          {practiceContent.firstTargetLanguage} first. Spanish, French and Mandarin Chinese come later.
        </Text>
      </View>
    </ScrollView>
  );
}

const stepAccentStyles = [
  { backgroundColor: colors.primarySoft },
  { backgroundColor: colors.accentSoft },
  { backgroundColor: colors.infoSoft },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    padding: spacing.xl,
  },
  brandBlock: {
    paddingTop: spacing.xl,
  },
  kicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  brand: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: '900',
  },
  positioning: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
    lineHeight: 28,
    marginTop: spacing.md,
  },
  intro: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.md,
  },
  cardKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
  detailPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  detailPillText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
  firstPracticeCard: {
    marginTop: spacing.xl,
  },
  stepsBlock: {
    marginTop: spacing.lg,
  },
  stepRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  stepNumber: {
    alignItems: 'center',
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 38,
  },
  stepNumberText: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  stepTextBlock: {
    flex: 1,
  },
  stepTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  stepBody: {
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.md,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
