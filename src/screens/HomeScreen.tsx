import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import {
  Badge,
  Card,
  GradientButton,
  GradientHero,
  LessonCard,
  ScreenContainer,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { foundationStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createHomeLearnState } from '../utils/homeLearnState';

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
  const learnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  function startToday() {
    if (learnState.hero.target === 'foundation') {
      onStartFoundation();
      return;
    }

    onOpenRoleplay(learnState.hero.target);
  }
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

  return (
    <ScreenContainer
      overline="Career Arcade"
      right={
        <View>
          <StreakBadge label={`${mission.streakDays} day streak`} />
        </View>
      }
      subtitle="One short English practice. The app chooses the next step."
      title="Ready for today?"
    >
      <GradientHero
        overline={learnState.hero.eyebrow}
        subtitle={learnState.hero.body}
        title={learnState.hero.title}
        tone="primary"
      >
        <View>
          <GradientButton label={learnState.hero.ctaLabel} onPress={startToday} />
        </View>
      </GradientHero>

      <View style={styles.badgeRow}>
        <XPBadge label={`${mission.xpTotal} XP`} />
        <Badge label={`Level ${mission.level}`} tone="purple" />
      </View>

      <AnimatedInstructionCard
        ctaLabel={learnState.hero.ctaLabel}
        stepTitle={activeLesson.title}
      />

      <LessonCard
        body={activeLesson.body}
        ctaLabel={activeLesson.ctaLabel}
        index={activeLessonIndex + 1}
        meta={activeLesson.meta}
        onPress={startActiveLesson}
        state={activeLesson.state}
        title={activeLesson.title}
        xpLabel={activeLesson.xpLabel}
      />

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

function AnimatedInstructionCard({
  ctaLabel,
  stepTitle,
}: {
  ctaLabel: string;
  stepTitle: string;
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
    <Card tone="accent" style={styles.instructionCard}>
      <View style={styles.instructionTarget}>
        <Animated.View
          style={[
            styles.instructionRing,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />
        <Text style={styles.instructionTargetText}>TAP</Text>
      </View>
      <View style={styles.instructionCopy}>
        <Text style={styles.instructionKicker}>Do this now</Text>
        <Text style={styles.instructionTitle}>{ctaLabel}</Text>
        <Text style={styles.instructionBody}>Then finish {stepTitle}. Nothing else to choose.</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  instructionCard: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing.lg,
  },
  instructionTarget: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 58,
    justifyContent: 'center',
    marginRight: spacing.lg,
    width: 58,
  },
  instructionRing: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    height: 58,
    position: 'absolute',
    width: 58,
  },
  instructionTargetText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  instructionCopy: {
    flex: 1,
  },
  instructionKicker: {
    color: colors.accentDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  instructionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  instructionBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
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
});
