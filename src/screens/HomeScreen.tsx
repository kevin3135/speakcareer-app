import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { RoleplayCard } from '../components/RoleplayCard';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { guidedIntroSteps, guidedStart } from '../data/guidedIntro';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createHomeLibraryState } from '../utils/homeLibrary';
import { createHomePracticeRecommendation } from '../utils/homeRecommendation';
import { createLocalProgressStats } from '../utils/localProgress';

type HomeScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function HomeScreen({ dailyTarget, onOpenRoleplay, sessions }: HomeScreenProps) {
  const homeRecommendation = createHomePracticeRecommendation(sessions, practiceContent.roleplays, {
    ctaLabel: guidedStart.ctaLabel,
    roleplayId: guidedStart.roleplayId,
    subtitle: guidedStart.subtitle,
    title: guidedStart.title,
  });
  const featured =
    practiceContent.roleplays.find((roleplay) => roleplay.id === homeRecommendation.roleplayId) ??
    practiceContent.roleplays[0];
  const dailyMission = createDailyMission(progressData.summary, sessions, dailyTarget);
  const localProgress = createLocalProgressStats(progressData.summary, sessions, dailyTarget);
  const hasSavedSession = sessions.length > 0;
  const homeLibrary = createHomeLibraryState(sessions, practiceContent.roleplays, guidedStart.roleplayId);
  const homeLibraryRoleplayIds = new Set(homeLibrary.previewRoleplays.map((roleplay) => roleplay.id));
  const visibleRoleplayCards = practiceContent.roleplays.filter((roleplay) =>
    homeLibraryRoleplayIds.has(roleplay.id),
  );

  return (
    <Screen
      title="SpeakCareer"
      subtitle="Practice professional English one clear step at a time."
    >
      <View style={styles.hero}>
        <Text style={styles.heroKicker}>Start here</Text>
        <Text style={styles.heroTitle}>{homeRecommendation.title}</Text>
        <Text style={styles.heroCopy}>{homeRecommendation.subtitle}</Text>
        <View style={styles.focusRow}>
          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>English</Text>
          </View>
          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>5 minutes</Text>
          </View>
          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>{dailyMission.rewardLabel}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <AppButton
            accessibilityHint={`Opens the recommended ${featured.title} roleplay`}
            label={homeRecommendation.ctaLabel}
            onPress={() => onOpenRoleplay(featured.id)}
          />
        </View>
      </View>

      <Card muted>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.sectionMeta}>3 steps</Text>
        </View>
        <View style={styles.stepList}>
          {guidedIntroSteps.map((step, index) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepTextBlock}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Text style={styles.sectionMeta}>{dailyMission.xpToday}/{dailyMission.xpGoal} XP</Text>
        </View>
        <View style={styles.progressBlock}>
          <ProgressBar label="Practice progress" value={dailyMission.progressPercent} />
        </View>
        <Text style={styles.copy}>
          {hasSavedSession
            ? `${sessions.length}/${dailyTarget} short practice${dailyTarget === 1 ? '' : 's'} done. ${localProgress.totalLocalXp} XP added this run.`
            : 'Your first step is one short Job Interview practice. Nothing else is required today.'}
        </Text>
      </Card>

      {homeLibrary.showRoleplayCards ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{homeLibrary.title}</Text>
            <Text style={styles.sectionMeta}>{homeLibrary.meta}</Text>
          </View>
          {visibleRoleplayCards.map((roleplay) => (
            <RoleplayCard
              key={roleplay.id}
              roleplay={roleplay}
              onPress={() => onOpenRoleplay(roleplay.id)}
            />
          ))}
        </>
      ) : (
        <Card muted>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{homeLibrary.title}</Text>
            <Text style={styles.sectionMeta}>{homeLibrary.meta}</Text>
          </View>
          <Text style={styles.copy}>{homeLibrary.body}</Text>
          <View style={styles.libraryPreviewList}>
            {homeLibrary.previewRoleplays.map((roleplay) => (
              <View key={roleplay.id} style={styles.libraryPreviewCard}>
                <Text style={styles.libraryPreviewTitle}>{roleplay.title}</Text>
                <Text style={styles.libraryPreviewBody}>{roleplay.focus}</Text>
                <Text style={styles.libraryPreviewMeta}>
                  {roleplay.category} / {roleplay.targetLevel}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primarySoft,
    borderColor: '#BDE7DC',
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  heroKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: spacing.sm,
  },
  heroCopy: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  focusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
  focusBadge: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  focusBadgeText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
  },
  buttonRow: {
    marginTop: spacing.md,
  },
  stepList: {
    marginTop: spacing.lg,
  },
  stepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 34,
  },
  stepNumberText: {
    color: colors.primaryDark,
    fontSize: typography.small,
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
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  copy: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  progressBlock: {
    marginTop: spacing.lg,
  },
  libraryPreviewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  libraryPreviewList: {
    marginTop: spacing.md,
  },
  libraryPreviewTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  libraryPreviewBody: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  libraryPreviewMeta: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
});
