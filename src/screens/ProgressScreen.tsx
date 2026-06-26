import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Screen } from '../components/Screen';
import { progressData } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';
import type { PracticeSession } from '../types';
import { formatSessionDate } from '../utils/sessionHistory';

type ProgressScreenProps = {
  sessions: PracticeSession[];
};

export function ProgressScreen({ sessions }: ProgressScreenProps) {
  const { summary, mistakeBank } = progressData;

  return (
    <Screen
      title="Progress"
      subtitle="A simple mistake bank for recurring English career communication patterns."
    >
      <View style={styles.statGrid}>
        <Card>
          <Text style={styles.statNumber}>{summary.minutesPracticed}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </Card>
        <Card>
          <Text style={styles.statNumber}>{summary.sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Skill snapshot</Text>
        <View style={styles.progressBlock}>
          <ProgressBar label="Clarity" value={summary.clarityScore} />
          <ProgressBar label="Confidence" value={summary.confidenceScore} />
        </View>
        <Text style={styles.nextFocus}>Next focus: {summary.nextFocus}</Text>
      </Card>

      <Text style={styles.sectionTitle}>Session history</Text>
      {sessions.length === 0 ? (
        <Card muted>
          <Text style={styles.emptyTitle}>No saved sessions yet</Text>
          <Text style={styles.emptyCopy}>
            Complete a roleplay answer, review it and save the session to build a simple local history.
          </Text>
        </Card>
      ) : (
        sessions.map((session) => (
          <Card key={session.id}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{session.roleplayTitle}</Text>
              <Text style={styles.sessionDate}>{formatSessionDate(session.completedAt)}</Text>
            </View>
            <Text style={styles.sessionMeta}>
              {session.readinessLabel} - {session.wordCount} words
            </Text>
            <Text style={styles.sessionPreview}>{session.answerPreview}</Text>
            <Text style={styles.sessionFeedback}>{session.feedbackSummary}</Text>
          </Card>
        ))
      )}

      <Text style={styles.sectionTitle}>Mistake bank</Text>
      {mistakeBank.map((mistake) => (
        <Card key={mistake.id}>
          <View style={styles.mistakeHeader}>
            <Text style={styles.category}>{mistake.category}</Text>
            <Text style={[styles.priority, styles[`priority${mistake.priority}`]]}>{mistake.priority}</Text>
          </View>
          <Text style={styles.label}>Original</Text>
          <Text style={styles.original}>{mistake.original}</Text>
          <Text style={styles.label}>Correction</Text>
          <Text style={styles.correction}>{mistake.correction}</Text>
          <Text style={styles.note}>{mistake.note}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
  },
  statNumber: {
    color: colors.accent,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  progressBlock: {
    marginTop: spacing.lg,
  },
  nextFocus: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  sessionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  sessionDate: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  sessionMeta: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  sessionPreview: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  sessionFeedback: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  mistakeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.h3,
    fontWeight: '900',
  },
  priority: {
    fontSize: typography.small,
    fontWeight: '900',
  },
  priorityHigh: {
    color: colors.danger,
  },
  priorityMedium: {
    color: colors.accent,
  },
  priorityLow: {
    color: colors.success,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
  original: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  correction: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  note: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: spacing.lg,
  },
});
