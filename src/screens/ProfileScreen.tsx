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
import { createProfileDailyTargetPlan } from '../utils/profileDailyTargetPlan';

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
  const dailyTargetPlans = dailyTargetOptions.map((target) => ({
    target,
    plan: createProfileDailyTargetPlan(target),
  }));
  const activeTargetPlan = dailyTargetPlans.find(({ target }) => target === dailyTarget)?.plan;

  return (
    <ScreenContainer
      overline="Me"
      subtitle="Choose a daily English pace you can repeat. Language and preview settings stay below."
      title="Practice rhythm"
    >
      <GradientHero
        overline="English MVP"
        subtitle="Short professional reps beat long rare sessions. Set a pace you can actually keep this week."
        title="Keep the streak realistic"
        tone="primary"
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

      <Card tone="strong">
        <View style={styles.dailyTargetHeader}>
          <Text style={styles.cardKicker}>Daily target</Text>
          {activeTargetPlan ? <Badge label={activeTargetPlan.badgeLabel} tone="success" /> : null}
        </View>
        <Text style={styles.cardTitle}>{activeTargetPlan?.title ?? 'Pick your pace'}</Text>
        <Text style={styles.cardBody}>
          {activeTargetPlan?.body ?? 'Choose a short English routine you can repeat this week.'}
        </Text>
        {activeTargetPlan ? (
          <View style={styles.targetSummaryRow}>
            {activeTargetPlan.stats.map((stat) => (
              <View key={stat.label} style={styles.targetSummaryStat}>
                <Text style={styles.targetSummaryLabel}>{stat.label}</Text>
                <Text style={styles.targetSummaryValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.segmentedControl}>
          {dailyTargetPlans.map(({ plan, target }) => {
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
                <Text style={[styles.segmentHint, isActive && styles.segmentHintActive]}>
                  {plan.optionPaceLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {activeTargetPlan ? (
          <View style={styles.targetNoteBox}>
            <Text style={styles.targetNoteLabel}>Why this pace works</Text>
            <Text style={styles.targetNoteText}>{activeTargetPlan.note}</Text>
          </View>
        ) : null}
      </Card>

      <SectionHeader
        subtitle="English first. Other languages stay out of the way until the core practice loop is stronger."
        title="Language plan"
      />
      <Card>
        <View style={styles.languageRow}>
          <Text style={styles.languageName}>{practiceContent.firstTargetLanguage}</Text>
          <Badge label="Active now" tone="success" />
        </View>
        {practiceContent.plannedLanguages.map((language) => (
          <View key={language} style={styles.languageRow}>
            <Text style={styles.plannedLanguage}>{language}</Text>
            <Badge label="Coming later" tone="info" />
          </View>
        ))}
      </Card>

      <SectionHeader
        subtitle="Private local preview now. Deeper plans stay secondary."
        title="Preview"
      />
      <PremiumCard
        benefits={[
          'Unlimited AI roleplays',
          'Advanced feedback and stronger rewrites',
          'Full mistake bank history',
          'Interview and meeting packs',
          'Future Spanish, French and Mandarin access',
        ]}
        subtitle="A preview of the deeper practice plan for serious career English."
        title="SpeakCareer Pro"
      />

      <Card tone="muted">
        <View style={styles.privacyHeader}>
          <Text style={styles.cardKicker}>Privacy</Text>
          <Badge label="Local preview" tone="info" />
        </View>
        <Text style={styles.cardTitle}>Private practice space</Text>
        <Text style={styles.cardBody}>Your progress stays on this device while SpeakCareer is in preview. No account needed.</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroAction: {
    marginTop: spacing.md,
  },
  dailyTargetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
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
    minHeight: 72,
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
  segmentHint: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginTop: spacing.xxs,
  },
  segmentHintActive: {
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
  privacyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  targetNoteBox: {
    backgroundColor: colors.white,
    borderColor: colors.primaryGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  targetNoteLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  targetNoteText: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  targetSummaryLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  targetSummaryRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  targetSummaryStat: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  targetSummaryValue: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
});
