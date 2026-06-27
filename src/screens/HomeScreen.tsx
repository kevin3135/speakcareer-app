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
import { createDailyMission } from '../utils/gamification';
import { createHomeDailyMissionCard } from '../utils/homeDailyMission';
import { createHomeLearnState } from '../utils/homeLearnState';
import { createLocalProgressStats } from '../utils/localProgress';

type HomeScreenProps = {
  dailyTarget: DailyPracticeTarget;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  onStartFoundation: () => void;
  sessions: PracticeSession[];
};

export function HomeScreen({
  dailyTarget,
  onOpenRoleplay,
  onStartFoundation,
  sessions,
}: HomeScreenProps) {
  const mission = createDailyMission(progressData.summary, sessions, dailyTarget);
  const localProgress = createLocalProgressStats(progressData.summary, sessions, dailyTarget);
  const missionCard = createHomeDailyMissionCard({
    dailyMission: mission,
    dailyTarget,
    localProgress,
    sessions,
  });
  const learnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions,
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
        meta={activeLesson.meta}
        onPress={startActiveLesson}
        title={activeLesson.title}
        xpLabel={activeLesson.xpLabel}
      />

      <Card
        style={[styles.missionCard, isMissionComplete && styles.missionCardComplete]}
        tone="muted"
      >
        <View style={styles.missionHeader}>
          <View style={styles.missionCopy}>
            <Text
              style={[
                styles.missionKicker,
                isMissionComplete && styles.missionKickerComplete,
              ]}
            >
              {isMissionComplete ? 'Mission complete' : 'Daily mission'}
            </Text>
            <Text style={styles.missionTitle}>{missionCard.title}</Text>
          </View>
          <Badge
            label={missionCard.targetLabel}
            tone={isMissionComplete ? 'success' : 'secondary'}
          />
        </View>
        <Text style={styles.missionBody}>{missionCard.body}</Text>
        <View style={styles.missionProgress}>
          <ProgressBar
            label={missionCard.progressLabel}
            tone="success"
            value={missionCard.progressPercent}
          />
        </View>
        <View style={styles.missionFooter}>
          <Text style={[styles.missionMeta, isMissionComplete && styles.missionMetaComplete]}>
            {missionCard.meta}
          </Text>
          <XPBadge label={missionCard.rewardLabel} />
        </View>
      </Card>

      {nextUnlock ? (
        <View style={styles.nextUnlock}>
          <Text style={styles.nextUnlockLabel}>Unlocks next</Text>
          <Text style={styles.nextUnlockTitle}>{nextUnlock.title}</Text>
          <Badge label={nextUnlock.state === 'completed' ? 'Done' : 'Later'} tone="info" />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

function AnimatedStartCard({
  ctaLabel,
  meta,
  onPress,
  title,
  xpLabel,
}: {
  ctaLabel: string;
  meta: string;
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
      <View style={styles.startTopRow}>
        <Text style={styles.startKicker}>Today</Text>
        <Badge label={xpLabel} tone="accent" />
      </View>

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
          <Text style={styles.startTargetText}>TAP</Text>
        </View>

        <View style={styles.startCopy}>
          <Text style={styles.startTitle}>{title}</Text>
          <Text style={styles.startMeta}>{meta}</Text>
        </View>
      </View>

      <View style={styles.startFooter}>
        <Text style={styles.startCta}>{ctaLabel}</Text>
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
  startTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startKicker: {
    color: colors.white,
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
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  startRing: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.pill,
    height: 60,
    position: 'absolute',
    width: 60,
  },
  startTargetText: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
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
  },
  startMeta: {
    color: colors.secondarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  startFooter: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  startCta: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  nextUnlock: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  missionBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
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
  missionFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  missionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
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
  missionMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  missionMetaComplete: {
    color: colors.successDark,
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
    fontSize: typography.small,
    fontWeight: '900',
  },
  nextUnlockTitle: {
    color: colors.primaryDark,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
