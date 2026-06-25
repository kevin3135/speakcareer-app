import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';

export function ProfileScreen() {
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
