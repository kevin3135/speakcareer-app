import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { colors, spacing, typography } from '../styles/theme';
import type { AIFeedback } from '../types';

type FeedbackPanelProps = {
  feedback: AIFeedback;
};

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <Card muted>
      <Text style={styles.eyebrow}>Mock AI feedback</Text>
      <Text style={styles.summary}>{feedback.summary}</Text>

      <View style={styles.scoreList}>
        {feedback.scores.map((score) => (
          <ProgressBar key={score.label} label={score.label} value={score.value} />
        ))}
      </View>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Strengths</Text>
          {feedback.strengths.map((item) => (
            <Text key={item} style={styles.bullet}>- {item}</Text>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Improve next</Text>
          {feedback.improvements.map((item) => (
            <Text key={item} style={styles.bullet}>- {item}</Text>
          ))}
        </View>
      </View>

      <Text style={styles.columnTitle}>Suggested rewrite</Text>
      <Text style={styles.rewrite}>{feedback.suggestedRewrite}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  summary: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  scoreList: {
    marginTop: spacing.lg,
  },
  columns: {
    marginTop: spacing.lg,
  },
  column: {},
  columnTitle: {
    color: colors.ink,
    fontSize: typography.h3,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  bullet: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  rewrite: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
