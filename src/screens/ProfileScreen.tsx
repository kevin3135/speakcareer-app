import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  PremiumCard,
  ScreenContainer,
  SectionHeader,
} from '../components/ui';
import { practiceContent } from '../data/content';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget } from '../types';

type ProfileScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onBackToLearn: () => void;
  onChangeDailyTarget: (target: DailyPracticeTarget) => void;
};

const dailyTargetOptions: DailyPracticeTarget[] = [1, 2, 3];

export function ProfileScreen({
  dailyTarget,
  onBackToLearn,
  onChangeDailyTarget,
}: ProfileScreenProps) {
  return (
    <ScreenContainer
      overline="Me"
      subtitle="Your local learner settings for the English MVP."
      title="English Career Learner"
    >
      <GradientHero
        overline="Goal"
        subtitle="Practice job interviews, meetings and professional conversations with AI."
        title="Confident professional English"
        tone="purple"
      >
        <View style={styles.heroAction}>
          <AppButton
            accessibilityHint="Return to the guided Learn path"
            label="Back to Learn"
            onPress={onBackToLearn}
            variant="secondary"
          />
        </View>
      </GradientHero>

      <Card>
        <Text style={styles.cardKicker}>Daily target</Text>
        <Text style={styles.cardTitle}>How hard should today feel?</Text>
        <Text style={styles.cardBody}>Keep it light and consistent. You can change this anytime.</Text>
        <View style={styles.segmentedControl}>
          {dailyTargetOptions.map((target) => {
            const isActive = target === dailyTarget;

            return (
              <Pressable
                accessibilityHint="Updates the daily practice target for this app run"
                accessibilityLabel={`Set daily target to ${target} ${target === 1 ? 'roleplay' : 'roleplays'}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                key={target}
                onPress={() => onChangeDailyTarget(target)}
                style={({ pressed }) => [
                  styles.segment,
                  isActive && styles.segmentActive,
                  pressed && styles.segmentPressed,
                ]}
              >
                <Text style={[styles.segmentValue, isActive && styles.segmentValueActive]}>
                  {target}
                </Text>
                <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                  {target === 1 ? 'roleplay' : 'roleplays'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionHeader title="Language plan" />
      <Card>
        <View style={styles.languageRow}>
          <Text style={styles.languageName}>{practiceContent.firstTargetLanguage}</Text>
          <Badge label="MVP active" tone="success" />
        </View>
        {practiceContent.plannedLanguages.map((language) => (
          <View key={language} style={styles.languageRow}>
            <Text style={styles.plannedLanguage}>{language}</Text>
            <Badge label="Later" tone="info" />
          </View>
        ))}
      </Card>

      <PremiumCard
        benefits={[
          'Unlimited AI roleplays',
          'Advanced feedback and stronger rewrites',
          'Full mistake bank history',
          'Interview and meeting packs',
          'Future Spanish, French and Mandarin access',
        ]}
        subtitle="A future upgrade preview for serious career practice. No payment is connected."
        title="SpeakCareer Pro"
      />

      <Card tone="muted">
        <Text style={styles.cardKicker}>Privacy</Text>
        <Text style={styles.cardTitle}>Local MVP mode</Text>
        <Text style={styles.cardBody}>Practice progress is stored on this device for now. No real auth, payments or AI API are connected.</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroAction: {
    marginTop: spacing.md,
  },
  cardKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  cardTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  cardBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  segmentedControl: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radius.md,
    flex: 1,
    minHeight: 62,
    justifyContent: 'center',
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
    fontSize: typography.h2,
    fontWeight: '900',
  },
  segmentValueActive: {
    color: colors.white,
  },
  segmentLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  segmentLabelActive: {
    color: colors.white,
  },
  languageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  languageName: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  plannedLanguage: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
