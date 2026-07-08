import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  ProgressBar,
  RoleplayCard,
  ScreenContainer,
  SectionHeader,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayDraft, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createPracticeAfterSavePreview } from '../utils/practiceAfterSavePreview';
import { createPracticeTargetPreview } from '../utils/practiceCompletion';
import { createPracticeDailySprint } from '../utils/practiceDailySprint';
import { createPracticeLibraryState } from '../utils/practiceLibraryState';
import { createPracticeLevelPayoff } from '../utils/practiceLevelPayoff';
import { createPracticeTimeline } from '../utils/practiceTimeline';

type PracticeScreenProps = {
  dailyTarget: DailyPracticeTarget;
  draft: RoleplayDraft | null;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function PracticeScreen({
  dailyTarget,
  draft,
  onOpenRoleplay,
  sessions,
}: PracticeScreenProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const mission = createDailyMission(progressData.summary, sessions, dailyTarget);
  const practiceTimeline = createPracticeTimeline(sessions);
  const libraryState = createPracticeLibraryState({
    draft,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const recommendedRoleplay =
    practiceContent.roleplays.find(
      (roleplay) => roleplay.id === libraryState.recommendedCard.roleplayId,
    ) ?? practiceContent.roleplays[0];
  const nextUnlockTitle = libraryState.runway?.items.find((item) => item.state === 'locked')?.title;
  const dailySprint = createPracticeDailySprint({
    dailyTarget,
    isResumeMode: libraryState.isResumeMode,
    nextUnlockTitle,
    recommendedRoleplayTitle: libraryState.recommendedCard.title,
    recommendedXpLabel: libraryState.recommendedCard.xp,
    sessions,
    streakDays: mission.streakDays,
  });
  const levelPayoff = createPracticeLevelPayoff({
    currentTotalXp: mission.xpTotal,
    xpReward: recommendedRoleplay.durationMinutes * 4,
  });
  const targetPreview = createPracticeTargetPreview({
    completedSessions: practiceTimeline.sessionsTodayCount,
    dailyTarget,
  });
  const afterSavePreview = createPracticeAfterSavePreview({
    isResumeMode: libraryState.isResumeMode,
    levelPayoff,
    recommendedPayoff: libraryState.recommendedPayoff,
    targetPreview,
  });
  const sprintProgressTone = dailySprint.statusTone === 'success' ? 'success' : 'secondary';

  return (
    <ScreenContainer
      overline="Practice library"
      subtitle={libraryState.isResumeMode
        ? 'Finish the saved answer first. The rest of the library stays available when you want a different focus.'
        : 'One recommended conversation first. Open the full library only when you want a different focus.'}
      title="Practice path"
    >
      <GradientHero
        overline={libraryState.isResumeMode ? 'Saved draft' : 'Recommended next'}
        subtitle={libraryState.subtitle}
        title={libraryState.title}
        tone="primary"
      >
        <Card style={styles.heroProgressCard} tone="dark">
          <View style={styles.heroProgressHeader}>
            <Text style={styles.heroProgressLabel}>Career path</Text>
            <Badge label={libraryState.meta} tone="accent" />
          </View>
          <ProgressBar
            label={libraryState.progressLabel}
            tone="accent"
            value={libraryState.progressPercent}
          />
        </Card>
      </GradientHero>

      <Card tone="strong">
        <View style={styles.runwayHeader}>
          <View style={styles.flexOne}>
            <Text style={styles.dailySprintKicker}>{dailySprint.eyebrow}</Text>
            <Text style={styles.dailySprintTitle}>{dailySprint.title}</Text>
          </View>
          <Badge label={dailySprint.statusLabel} tone={dailySprint.statusTone} />
        </View>
        <Text style={styles.dailySprintBody}>{dailySprint.body}</Text>
        <View style={styles.dailySprintHabitStrip}>
          <View style={styles.flexOne}>
            <Text style={styles.dailySprintHabitLabel}>{dailySprint.streakLabel}</Text>
            <Text style={styles.dailySprintHabitText}>{dailySprint.streakText}</Text>
          </View>
          <StreakBadge label={dailySprint.streakBadgeLabel} />
        </View>
        <View style={styles.dailySprintPayoff}>
          <Text style={styles.dailySprintPayoffLabel}>After save</Text>
          <Text numberOfLines={1} style={styles.dailySprintPayoffText}>
            {dailySprint.afterSavePayoff}
          </Text>
        </View>
        <View style={styles.dailySprintMetaRow}>
          <Text style={styles.dailySprintMetaLabel}>Reward when saved</Text>
          <XPBadge label={dailySprint.rewardLabel} />
        </View>
        <View style={styles.dailySprintProgress}>
          <ProgressBar
            label={dailySprint.progressLabel}
            tone={sprintProgressTone}
            value={dailySprint.progressPercent}
          />
        </View>
      </Card>

      <SectionHeader
        subtitle={libraryState.isResumeMode
          ? 'Return to the unfinished answer now so the app keeps one clear next step.'
          : 'Stay in sequence when you want the clearest next action.'}
        title="Do this now"
      />

      <RoleplayCard
        category={libraryState.recommendedCard.categoryLabel}
        ctaLabel={libraryState.recommendedCard.ctaLabel}
        description={libraryState.recommendedCard.description}
        difficulty={libraryState.recommendedCard.difficulty}
        focus={libraryState.recommendedCard.focus}
        onPress={() => onOpenRoleplay(libraryState.recommendedCard.roleplayId)}
        time={libraryState.recommendedCard.time}
        title={libraryState.recommendedCard.title}
        xp={libraryState.recommendedCard.xp}
      />

      <Card tone="strong">
        <View style={styles.afterSaveHeader}>
          <View style={styles.flexOne}>
            <Text style={styles.afterSaveEyebrow}>{afterSavePreview.eyebrow}</Text>
            <Text style={styles.afterSaveTitle}>{afterSavePreview.title}</Text>
          </View>
          <XPBadge label={afterSavePreview.badgeLabel} />
        </View>
        <View style={styles.afterSaveRows}>
          {afterSavePreview.rows.map((row) => (
            <View key={row.label} style={styles.afterSaveRow}>
              <Text style={styles.afterSaveRowLabel}>{row.label}</Text>
              <Text style={styles.afterSaveRowValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </Card>

      {libraryState.runway ? (
        <Card tone="muted">
          <View style={styles.runwayHeader}>
            <View style={styles.flexOne}>
              <Text style={styles.runwayKicker}>{libraryState.runway.eyebrow}</Text>
              <Text style={styles.runwayTitle}>{libraryState.runway.title}</Text>
            </View>
            <Badge label={libraryState.runway.progressLabel} tone="info" />
          </View>
          <Text style={styles.runwayBody}>{libraryState.runway.body}</Text>
          <View style={styles.runwayList}>
            {libraryState.runway.items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.runwayItem,
                  item.state === 'active' && styles.runwayItemActive,
                  item.state === 'locked' && styles.runwayItemLocked,
                ]}
              >
                <View
                  style={[
                    styles.runwaySequence,
                    item.state === 'active' && styles.runwaySequenceActive,
                    item.state === 'locked' && styles.runwaySequenceLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.runwaySequenceText,
                      item.state === 'active' && styles.runwaySequenceTextActive,
                      item.state === 'locked' && styles.runwaySequenceTextLocked,
                    ]}
                  >
                    {item.sequenceLabel}
                  </Text>
                </View>
                <View style={styles.flexOne}>
                  <View style={styles.runwayItemHeader}>
                    <Text numberOfLines={1} style={styles.runwayItemTitle}>
                      {item.title}
                    </Text>
                    <Badge
                      label={item.statusLabel}
                      tone={
                        item.state === 'done'
                          ? 'success'
                          : item.state === 'active'
                            ? 'accent'
                            : 'secondary'
                      }
                    />
                  </View>
                  <Text numberOfLines={1} style={styles.runwayItemMeta}>
                    {item.metaLabel}
                  </Text>
                </View>
                <XPBadge label={item.xpLabel} />
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      <SectionHeader
        action={libraryState.browseCards.length > 0 ? (
          <AppButton
            accessibilityHint={isLibraryOpen
              ? 'Hide the rest of the practice library'
              : 'Show the rest of the practice library'}
            label={isLibraryOpen
              ? 'Hide list'
              : libraryState.isResumeMode
                ? 'Switch roleplay'
                : 'Change focus'}
            onPress={() => setIsLibraryOpen((isOpen) => !isOpen)}
            size="small"
            variant="quiet"
          />
        ) : undefined}
        subtitle={libraryState.isResumeMode
          ? 'Open this only if you want to leave the saved answer for later and practice a different work situation.'
          : 'Use this only when you want to break sequence and practice another work situation.'}
        title="Other roleplays"
      />

      {libraryState.browseCards.length > 0 ? (
        isLibraryOpen ? (
          libraryState.browseCards.map((card) => (
            <RoleplayCard
              category={card.categoryLabel}
              ctaLabel={card.ctaLabel}
              description={card.description}
              difficulty={card.difficulty}
              focus={card.focus}
              key={card.id}
              onPress={() => onOpenRoleplay(card.roleplayId)}
              time={card.time}
              title={card.title}
              xp={card.xp}
            />
          ))
        ) : (
          <Card tone="muted">
            <View style={styles.libraryPreviewHeader}>
              <Text style={styles.libraryKicker}>{libraryState.closedPreview.eyebrow}</Text>
              <Badge label={libraryState.browseLabel} tone="secondary" />
            </View>
            <Text style={styles.libraryTitle}>{libraryState.closedPreview.title}</Text>
            <Text style={styles.libraryBody}>{libraryState.closedPreview.body}</Text>
            <View style={styles.libraryPreviewRow}>
              {libraryState.closedPreview.previewTitles.map((title) => (
                <View key={title} style={styles.libraryPreviewPill}>
                  <Text numberOfLines={1} style={styles.libraryPreviewPillText}>
                    {title}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  dailySprintBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  dailySprintHabitLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  dailySprintHabitStrip: {
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dailySprintHabitText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  dailySprintKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  dailySprintMetaLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  dailySprintMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  dailySprintProgress: {
    marginTop: spacing.md,
  },
  dailySprintPayoff: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryGlow,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dailySprintPayoffLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  dailySprintPayoffText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  dailySprintTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  flexOne: {
    flex: 1,
    minWidth: 0,
  },
  heroProgressCard: {
    backgroundColor: colors.scrim,
    borderColor: colors.primaryGlow,
    padding: spacing.md,
  },
  heroProgressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  heroProgressLabel: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  afterSaveEyebrow: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  afterSaveHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  afterSaveRow: {
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  afterSaveRowLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    minWidth: 52,
  },
  afterSaveRows: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  afterSaveRowValue: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    flexShrink: 1,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    minWidth: 0,
  },
  afterSaveTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  libraryBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  libraryKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  libraryTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
  libraryPreviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  libraryPreviewPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    maxWidth: '48%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  libraryPreviewPillText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  libraryPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  runwayBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  runwayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  runwayItem: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  runwayItemActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  runwayItemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  runwayItemLocked: {
    backgroundColor: colors.surfaceMuted,
  },
  runwayItemMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  runwayItemTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
  },
  runwayKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  runwayList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  runwaySequence: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  runwaySequenceActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
  },
  runwaySequenceLocked: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  runwaySequenceText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  runwaySequenceTextActive: {
    color: colors.ink,
  },
  runwaySequenceTextLocked: {
    color: colors.textMuted,
  },
  runwayTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
});
