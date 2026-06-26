import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { practiceContent } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';

type OnboardingScreenProps = {
  onContinue: () => void;
};

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandBlock}>
        <Text style={styles.kicker}>Career English trainer</Text>
        <Text style={styles.brand}>SpeakCareer</Text>
        <Text style={styles.positioning}>{practiceContent.positioning}</Text>
      </View>

      <View style={styles.previewRail}>
        <View style={styles.previewTile}>
          <Text style={styles.previewValue}>5</Text>
          <Text style={styles.previewLabel}>roleplays</Text>
        </View>
        <View style={styles.previewTile}>
          <Text style={styles.previewValue}>5:00</Text>
          <Text style={styles.previewLabel}>sprints</Text>
        </View>
        <View style={styles.previewTile}>
          <Text style={styles.previewValue}>XP</Text>
          <Text style={styles.previewLabel}>feedback</Text>
        </View>
      </View>

      <Card>
        <Text style={styles.cardTitle}>English MVP focus</Text>
        <Text style={styles.body}>
          Practice the professional conversations that create real career leverage:
          interviews, meetings, presentations, sales calls and workplace small talk.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>- Roleplay with realistic workplace prompts</Text>
          <Text style={styles.item}>- Review mock AI feedback before real API work</Text>
          <Text style={styles.item}>- Track recurring mistakes in one mistake bank</Text>
        </View>
      </Card>

      <View style={styles.footer}>
        <AppButton label="Start practicing" onPress={onContinue} />
        <Text style={styles.note}>Spanish, French and Mandarin Chinese are planned after the English MVP is solid.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  brandBlock: {
    paddingTop: spacing.xxl,
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
  previewRail: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.sm,
  },
  previewTile: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  previewValue: {
    color: colors.primaryDark,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  previewLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.primaryDark,
    fontSize: typography.h2,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 23,
  },
  list: {
    marginTop: spacing.lg,
  },
  item: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  footer: {
    marginTop: spacing.md,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    textAlign: 'center',
  },
});
