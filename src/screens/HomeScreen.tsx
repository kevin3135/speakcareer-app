import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Screen } from '../components/Screen';
import { practiceContent, progressData } from '../data/content';
import { guidedStart } from '../data/guidedIntro';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createHomeDailyMissionCard } from '../utils/homeDailyMission';
import { createHomeHeroFocusLabels } from '../utils/homeHeroLabels';
import { createHomeLibraryState } from '../utils/homeLibrary';
import { createHomePracticeRecommendation } from '../utils/homeRecommendation';
import { createHomeQuestPath } from '../utils/homeQuestPath';
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
  const homeDailyMission = createHomeDailyMissionCard({
    dailyMission,
    dailyTarget,
    localProgress,
    sessions,
  });
  const heroFocusLabels = createHomeHeroFocusLabels({
    detailLabels: guidedStart.detailLabels,
    rewardLabel: dailyMission.rewardLabel,
    sessions,
  });
  const homeLibrary = createHomeLibraryState(sessions, practiceContent.roleplays, guidedStart.roleplayId);
  const homeQuestPath = createHomeQuestPath({
    previewRoleplays: homeLibrary.previewRoleplays,
    recommendedRoleplay: featured,
    sessions,
  });

  return (
    <Screen
      title="SpeakCareer"
      subtitle="Your daily career English quest."
    >
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroKicker}>{"Today's quest"}</Text>
          <View style={styles.streakPill}>
            <Text style={styles.streakPillLabel}>Streak</Text>
            <Text style={styles.streakPillValue}>{dailyMission.streakDays} days</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>{homeDailyMission.title}</Text>
        <Text style={styles.heroCopy}>{homeRecommendation.subtitle}</Text>
        <View style={styles.focusRow}>
          {heroFocusLabels.map((label) => (
            <View key={label} style={styles.focusBadge}>
              <Text style={styles.focusBadgeText}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.levelPanel}>
          <View style={styles.levelStat}>
            <Text style={styles.levelStatLabel}>Level</Text>
            <Text style={styles.levelStatValue}>{dailyMission.level}</Text>
          </View>
          <View style={styles.levelProgress}>
            <ProgressBar
              label={homeDailyMission.progressLabel}
              value={homeDailyMission.progressPercent}
            />
          </View>
        </View>
        <View style={styles.questStatRow}>
          <View style={styles.questStat}>
            <Text style={styles.questStatLabel}>Target</Text>
            <Text style={styles.questStatValue}>{homeDailyMission.targetLabel}</Text>
          </View>
          <View style={styles.questStat}>
            <Text style={styles.questStatLabel}>Reward</Text>
            <Text style={styles.questStatValue}>{homeDailyMission.rewardLabel}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <AppButton
            accessibilityHint={`Opens the recommended ${featured.title} roleplay`}
            label={homeRecommendation.ctaLabel.replace('sprint', 'quest')}
            onPress={() => onOpenRoleplay(featured.id)}
          />
        </View>
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{homeQuestPath.title}</Text>
          <Text style={styles.sectionMeta}>{homeQuestPath.meta}</Text>
        </View>
        <View style={styles.questPath}>
          {homeQuestPath.nodes.map((node, index) => (
            <View key={node.id} style={styles.questNodeRow}>
              <View
                style={[
                  styles.questNodeMarker,
                  node.status === 'active' && styles.questNodeMarkerActive,
                  node.status === 'done' && styles.questNodeMarkerDone,
                ]}
              >
                <Text
                  style={[
                    styles.questNodeMarkerText,
                    node.status !== 'locked' && styles.questNodeMarkerTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <View style={styles.questNodeCard}>
                <View style={styles.questNodeHeader}>
                  <Text style={styles.questNodeTitle}>{node.title}</Text>
                  <Text
                    style={[
                      styles.questNodeTag,
                      node.status === 'active' && styles.questNodeTagActive,
                      node.status === 'done' && styles.questNodeTagDone,
                    ]}
                  >
                    {node.tag}
                  </Text>
                </View>
                <Text style={styles.questNodeBody}>{node.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card muted>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why practice now</Text>
          <Text style={styles.sectionMeta}>{homeDailyMission.meta}</Text>
        </View>
        <Text style={styles.copy}>{homeDailyMission.body}</Text>
        <Text style={styles.reasonText}>{homeDailyMission.reason}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#EAF7F2',
    borderColor: '#A9DCCF',
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  levelPanel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  levelProgress: {
    flex: 1,
  },
  levelStat: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    justifyContent: 'center',
    marginRight: spacing.md,
    minHeight: 64,
    width: 72,
  },
  levelStatLabel: {
    color: colors.accentSoft,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  levelStatValue: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: 2,
  },
  questPath: {
    marginTop: spacing.lg,
  },
  questNodeBody: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  questNodeCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  questNodeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  questNodeMarker: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: spacing.sm,
    width: 38,
  },
  questNodeMarkerActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  questNodeMarkerDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  questNodeMarkerText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '900',
  },
  questNodeMarkerTextActive: {
    color: colors.surface,
  },
  questNodeRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  questNodeTag: {
    backgroundColor: colors.infoSoft,
    borderRadius: radii.sm,
    color: colors.info,
    flexShrink: 0,
    fontSize: typography.small,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  questNodeTagActive: {
    backgroundColor: colors.accentSoft,
    color: colors.primaryDark,
  },
  questNodeTagDone: {
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
  },
  questNodeTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '900',
  },
  questStat: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  questStatLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  questStatRow: {
    columnGap: spacing.sm,
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  questStatValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  reasonText: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  streakPill: {
    alignItems: 'flex-end',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  streakPillLabel: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  streakPillValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: 1,
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
});
