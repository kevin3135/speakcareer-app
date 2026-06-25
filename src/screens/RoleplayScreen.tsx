import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { RoleplayId, RoleplayScenario } from '../types';

type RoleplayScreenProps = {
  roleplay: RoleplayScenario;
  onSelectRoleplay: (roleplayId: RoleplayId) => void;
};

export function RoleplayScreen({ roleplay, onSelectRoleplay }: RoleplayScreenProps) {
  const [showFeedback, setShowFeedback] = useState(true);

  return (
    <Screen
      title="Roleplay"
      subtitle="Practice a realistic workplace conversation. AI is mocked until backend integration is ready."
    >
      <View style={styles.selector}>
        {practiceContent.roleplays.map((item) => {
          const isActive = item.id === roleplay.id;

          return (
            <Pressable
              accessibilityRole="button"
              key={item.id}
              onPress={() => onSelectRoleplay(item.id)}
              style={[styles.selectorItem, isActive && styles.selectorItemActive]}
            >
              <Text style={[styles.selectorText, isActive && styles.selectorTextActive]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <Text style={styles.title}>{roleplay.title}</Text>
        <Text style={styles.focus}>{roleplay.focus}</Text>
        <Text style={styles.description}>{roleplay.description}</Text>

        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Context</Text>
          <Text style={styles.detailText}>{roleplay.workplaceContext}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Your goal</Text>
          <Text style={styles.detailText}>{roleplay.userGoal}</Text>
        </View>
      </Card>

      <Card muted>
        <Text style={styles.detailLabel}>{roleplay.aiPersona} opens with</Text>
        <Text style={styles.openingLine}>{roleplay.openingLine}</Text>
      </Card>

      <Card>
        <Text style={styles.detailLabel}>Useful phrases</Text>
        <View style={styles.phraseList}>
          {roleplay.suggestedPhrases.map((phrase) => (
            <Text key={phrase} style={styles.phrase}>- {phrase}</Text>
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <AppButton
          label={showFeedback ? 'Hide mock feedback' : 'Show mock feedback'}
          onPress={() => setShowFeedback((value) => !value)}
        />
        <AppButton label="Backend later" onPress={() => setShowFeedback(true)} variant="secondary" />
      </View>

      {showFeedback ? <FeedbackPanel feedback={roleplay.feedback} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectorItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectorItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectorText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  selectorTextActive: {
    color: colors.surface,
  },
  title: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  focus: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  detailBlock: {
    marginTop: spacing.lg,
  },
  detailLabel: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  detailText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  openingLine: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '700',
    lineHeight: 28,
  },
  phraseList: {
    gap: spacing.sm,
  },
  phrase: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.md,
  },
});
