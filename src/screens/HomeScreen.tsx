import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Badge,
  Card,
  ProgressBar,
  ScreenContainer,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { foundationStart } from '../data/guidedIntro';
import { colors, fonts, radius, shadows, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { FOUNDATION_TOTAL_STEPS } from '../utils/foundationProgressStorage';
import { createDailyMission } from '../utils/gamification';
import { createHomeDailyMissionCard } from '../utils/homeDailyMission';
import { createHomeLearnState } from '../utils/homeLearnState';
import { createLevelProgress } from '../utils/levelProgress';
import { createLocalProgressStats } from '../utils/localProgress';

type HomeScreenProps = {
  dailyTarget: DailyPracticeTarget;
  foundationCompletedSteps: number;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  onStartFoundation: () => void;
  sessions: PracticeSession[];
};

export function HomeScreen({
  dailyTarget,
  foundationCompletedSteps,
  onOpenRoleplay,
  onStartFoundation,
  sessions,
}: HomeScreenProps) {
  const hasCompletedFoundation = foundationCompletedSteps >= FOUNDATION_TOTAL_STEPS;
  const mission = createDailyMission(progressData.summary, sessions, dailyTarget);
  const localProgress = createLocalProgressStats(progressData.summary, sessions, dailyTarget);
  const missionCard = createHomeDailyMissionCard({
    dailyMission: mission,
    dailyTarget,
    hasCompletedFoundation,
    localProgress,
    sessions,
  });
  const levelProgress = createLevelProgress(mission.xpTotal);
  const learnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationCompletedSteps,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions,
    totalFoundationSteps: FOUNDATION_TOTAL_STEPS,
  });
  const activeLessonIndex = Math.max(
    0,
    learnState.steps.findIndex((lesson) => lesson.state === 'current'),
  );
  const activeLesson = learnState.steps[activeLessonIndex] ?? learnState.steps[0];
  const activeRoleplayId = activeLesson.roleplayId;
  const startActiveLesson = activeRoleplayId
    ? () => onOpenRoleplay(activeRoleplayId)
    : onStartFoundation;
  const previewLessons = learnState.steps.filter((_, index) => index !== activeLessonIndex);
  const nextUnlock = previewLessons.find((lesson) => lesson.state === 'locked') ?? previewLessons[0];
  const isMissionComplete = missionCard.progressPercent >= 100;

  return (
    <ScreenContainer>
      <View style={styles.statusRow}>
        <StreakBadge label={`${mission.streakDays} day streak`} />
        <XPBadge label={`${mission.xpTotal} XP`} />
      </View>

      <AnimatedStartCard
        ctaLabel={activeLesson.ctaLabel ?? learnState.hero.ctaLabel}
        habitLabel={isMissionComplete ? 'Today done' : 'Today goal'}
        habitValue={missionCard.targetLabel}
        levelLabel={levelProgress.currentLevelLabel}
        levelProgressLabel={levelProgress.progressLabel}
        levelProgressPercent={levelProgress.progressPercent}
        onPress={startActiveLesson}
        title={activeLesson.title}
        xpLabel={activeLesson.xpLabel}
      />

      <Card
        style={[styles.missionCard, isMissionComplete && styles.missionCardComplete]}
        tone="muted"
      >
        <View style={styles.missionHeader}>
          <View style={[styles.missionNode, isMissionComplete && styles.missionNodeComplete]}>
            <Text
              style={[styles.missionNodeText, isMissionComplete && styles.missionNodeTextComplete]}
            >
              {isMissionComplete ? 'Done' : 'Goal'}
            </Text>
          </View>
          <View style={styles.missionCopy}>
            <Text
              style={[
                styles.missionKicker,
                isMissionComplete && styles.missionKickerComplete,
              ]}
            >
              {isMissionComplete ? 'Mission complete' : 'Today'}
            </Text>
            <Text numberOfLines={1} style={styles.missionTitle}>
              {missionCard.title}
            </Text>
          </View>
          <XPBadge label={missionCard.rewardLabel} />
        </View>
        <View style={styles.missionProgress}>
          <ProgressBar
            label={missionCard.progressLabel}
            tone="success"
            value={missionCard.progressPercent}
          />
        </View>
      </Card>

      {nextUnlock ? (
        <View style={styles.nextUnlock}>
          <View
            style={[
              styles.nextUnlockNode,
              nextUnlock.state === 'completed' && styles.nextUnlockNodeComplete,
            ]}
          >
            <Text
              style={[
                styles.nextUnlockNodeText,
                nextUnlock.state === 'completed' && styles.nextUnlockNodeTextComplete,
              ]}
            >
              {nextUnlock.state === 'completed' ? 'Done' : 'Next'}
            </Text>
          </View>
          <View style={styles.nextUnlockCopy}>
            <Text style={styles.nextUnlockLabel}>
              {nextUnlock.state === 'completed' ? 'Completed' : 'Unlock next'}
            </Text>
            <Text numberOfLines={1} style={styles.nextUnlockTitle}>
              {nextUnlock.title}
            </Text>
          </View>
        </View>
      ) : null}
    </ScreenContainer>
  );
}

function AnimatedStartCard({
  ctaLabel,
  habitLabel,
  habitValue,
  levelLabel,
  levelProgressLabel,
  levelProgressPercent,
  onPress,
  title,
  xpLabel,
}: {
  ctaLabel: string;
  habitLabel: string;
  habitValue: string;
  levelLabel: string;
  levelProgressLabel: string;
  levelProgressPercent: number;
  onPress: () => void;
  title: string;
  xpLabel: string;
}) {
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          duration: 850,
          easing: Easing.out(Easing.quad),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          duration: 650,
          easing: Easing.in(Easing.quad),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.22],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.95],
  });

  return (
    <Pressable
      accessibilityHint={`Starts ${title}`}
      accessibilityLabel={ctaLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.startCard, pressed && styles.pressed]}
    >
      <View style={styles.startMainRow}>
        <View style={styles.startTarget}>
          <Animated.View
            style={[
              styles.startRing,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <Text style={styles.startTargetText}>START</Text>
        </View>

        <View style={styles.startCopy}>
          <Text style={styles.startKicker}>Do this now</Text>
          <Text style={styles.startTitle}>{title}</Text>
          <View style={styles.startRewardRow}>
            <Text numberOfLines={1} style={styles.startHint}>
              {ctaLabel}
            </Text>
            <Badge label={xpLabel} tone="accent" />
          </View>
        </View>
      </View>
      <View style={styles.startHabitPill}>
        <Text style={styles.startHabitLabel}>{habitLabel}</Text>
        <Text numberOfLines={1} style={styles.startHabitValue}>
          {habitValue}
        </Text>
      </View>
      <View style={styles.startLevelBox}>
        <View style={styles.startLevelHeader}>
          <View style={styles.startLevelPill}>
            <Text style={styles.startLevelPillText}>{levelLabel}</Text>
          </View>
          <Text numberOfLines={1} style={styles.startLevelMeta}>
            {levelProgressLabel}
          </Text>
        </View>
        <View style={styles.startLevelTrack}>
          <View
            style={[
              styles.startLevelFill,
              { width: `${Math.max(0, Math.min(levelProgressPercent, 100))}%` },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  startCard: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.medium,
  },
  startKicker: {
    color: colors.secondarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  startMainRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  startTarget: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  startRing: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.pill,
    height: 76,
    position: 'absolute',
    width: 76,
  },
  startTargetText: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  startCopy: {
    flex: 1,
  },
  startTitle: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  startHint: {
    color: colors.white,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  startRewardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  startHabitLabel: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  startHabitPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderColor: colors.secondarySoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  startHabitValue: {
    color: colors.ink,
    flexShrink: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  startLevelBox: {
    backgroundColor: colors.successDark,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  startLevelFill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    height: '100%',
  },
  startLevelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startLevelMeta: {
    color: colors.white,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '800',
    marginLeft: spacing.sm,
    textAlign: 'right',
  },
  startLevelPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  startLevelPillText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  startLevelTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.pill,
    height: 8,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  nextUnlock: {
    alignItems: 'center',
    backgroundColor: colors.lockedSoft,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  missionCard: {
    padding: spacing.md,
  },
  missionCardComplete: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  missionCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  missionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  missionKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  missionKickerComplete: {
    color: colors.successDark,
  },
  missionNode: {
    alignItems: 'center',
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  missionNodeComplete: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
  },
  missionNodeText: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  missionNodeTextComplete: {
    color: colors.white,
  },
  missionProgress: {
    marginTop: spacing.md,
  },
  missionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  nextUnlockLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  nextUnlockCopy: {
    flex: 1,
  },
  nextUnlockNode: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.locked,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  nextUnlockNodeComplete: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  nextUnlockNodeText: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  nextUnlockNodeTextComplete: {
    color: colors.successDark,
  },
  nextUnlockTitle: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
