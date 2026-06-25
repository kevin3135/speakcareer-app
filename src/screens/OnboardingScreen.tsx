import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { practiceContent } from '../data/content';
import { colors, spacing, typography } from '../styles/theme';

type OnboardingScreenProps = {
  onContinue: () => void;
};

export function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brandBlock}>
        <Text style={styles.brand}>SpeakCareer</Text>
        <Text style={styles.positioning}>{practiceContent.positioning}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  brandBlock: {
    gap: spacing.md,
    paddingTop: spacing.xxl,
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
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  item: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  footer: {
    gap: spacing.md,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    textAlign: 'center',
  },
});
