import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { DailyPracticeTarget } from '../types';

type ProfileScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onChangeDailyTarget: (target: DailyPracticeTarget) => void;
};

const dailyTargetOptions: DailyPracticeTarget[] = [1, 2, 3];

export function ProfileScreen({ dailyTarget, onChangeDailyTarget }: ProfileScreenProps) {
  return (
    <Screen
      title="Profile"
      subtitle="Local mock profile. Auth, subscriptions and analytics are intentionally not connected yet."
    >
      <Card>
        <Text style={styles.name}>English Career Learner</Text>
        <Text style={styles.meta}>Goal: confident professional conversations</Text>
        <Text style={styles.meta}>Current language: {practiceContent.firstTargetLanguage}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Daily target</Text>
        <Text style={styles.meta}>Choose how many career roleplays you want to complete per day.</Text>
        <View style={styles.segmentedControl}>
          {dailyTargetOptions.map((target) => {
            const isActive = target === dailyTarget;

            return (
              <Pressable
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
        <Text style={styles.targetNote}>
          This updates Home during this app run. Persistence comes later.
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Language plan</Text>
        <View style={styles.languageList}>
          <Text style={styles.activeLanguage}>English - MVP active</Text>
          {practiceContent.plannedLanguages.map((language) => (
            <Text key={language} style={styles.plannedLanguage}>{language} - planned later</Text>
          ))}
        </View>
      </Card>

      <Card muted>
        <Text style={styles.sectionTitle}>Integration status</Text>
        <View style={styles.integrationList}>
          <Text style={styles.integration}>Supabase auth and database - later</Text>
          <Text style={styles.integration}>OpenAI through backend only - later</Text>
          <Text style={styles.integration}>RevenueCat subscriptions - later</Text>
          <Text style={styles.integration}>PostHog analytics - later</Text>
          <Text style={styles.integration}>Sentry error tracking - later</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  segmentedControl: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radii.sm,
    flex: 1,
    minHeight: 58,
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
    fontSize: typography.h2,
    fontWeight: '900',
  },
  segmentValueActive: {
    color: colors.surface,
  },
  segmentLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  segmentLabelActive: {
    color: colors.surface,
  },
  targetNote: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  languageList: {},
  activeLanguage: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '900',
  },
  plannedLanguage: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  integrationList: {},
  integration: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
});
