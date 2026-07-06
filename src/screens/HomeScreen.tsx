import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Badge,
  ProgressBar,
  ScreenContainer,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { foundationStart } from '../data/guidedIntro';
import { colors, fonts, radius, shadows, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayDraft, RoleplayId } from '../types';
import { FOUNDATION_TOTAL_STEPS } from '../utils/foundationProgressStorage';
import { createDailyMission } from '../utils/gamification';
import { createHomeCoachCue } from '../utils/homeCoachFocus';
import { createHomeDailyMissionCard } from '../utils/homeDailyMission';
import { createHomeLearnState } from '../utils/homeLearnState';
import { createHomeRunway } from '../utils/homeRunway';
import { createHomeStartPreview } from '../utils/homeStartPreview';
import { createLevelProgress } from '../utils/levelProgress';
import { createLocalProgressStats } from '../utils/localProgress';
import { createRoleplayResumeCue } from '../utils/roleplayResumeCue';
import { summarizePracticeAnswer } from '../utils/answerReview';

type HomeScreenProps = {
  dailyTarget: DailyPracticeTarget;
  draft: RoleplayDraft | null;
  foundationCompletedSteps: number;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  onStartFoundation: () => void;
  sessions: PracticeSession[];
};

export function HomeScreen({
  dailyTarget,
  draft,
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
  const resumeRoleplay = draft
    ? practiceContent.roleplays.find((roleplay) => roleplay.id === draft.roleplayId) ?? null
    : null;
  const resumeReview = draft ? summarizePracticeAnswer(draft.draftAnswer) : null;
  const resumeCue = resumeReview ? createRoleplayResumeCue(resumeReview) : null;
  const activeRoleplayId = activeLesson.roleplayId;
  const startActiveLesson = resumeRoleplay
    ? () => onOpenRoleplay(resumeRoleplay.id)
    : activeRoleplayId
      ? () => onOpenRoleplay(activeRoleplayId)
      : onStartFoundation;
  const previewLessons = learnState.steps.filter((_, index) => index !== activeLessonIndex);
  const nextUnlock = previewLessons.find((lesson) => lesson.state === 'locked') ?? previewLessons[0];
  const isMissionComplete = missionCard.progressPercent >= 100;
  const dailyPaceLabel = `${dailyTarget}/day`;
  const completedPathSteps = learnState.steps.filter((lesson) => lesson.state === 'completed').length;
  const totalPathSteps = Math.max(learnState.steps.length, 1);
  const hasSavedPractice = sessions.length > 0;
  const isFullPathCleared = completedPathSteps >= totalPathSteps;
  const pathStatusLabel = `${completedPathSteps}/${totalPathSteps} cleared`;
  const startCardCtaLabel = resumeRoleplay
    ? 'Finish your saved answer'
    : activeLesson.ctaLabel ?? learnState.hero.ctaLabel;
  const startCardKickerLabel = resumeRoleplay
    ? 'Resume now'
    : isFullPathCleared
      ? 'Replay now'
      : hasSavedPractice
        ? 'Unlocked now'
        : 'Do this now';
  const startCardPathTone = hasSavedPractice && !resumeRoleplay ? 'accent' : 'secondary';
  const startCardHabitLabel = resumeRoleplay && resumeCue
    ? resumeCue.badgeLabel
    : isMissionComplete
      ? 'Today done'
      : 'Your pace';
  const startCardHabitValue = resumeRoleplay && resumeCue
    ? resumeCue.body
    : isMissionComplete
      ? missionCard.targetLabel
      : dailyPaceLabel;
  const startCardPathLabel = resumeRoleplay ? 'Resume now' : pathStatusLabel;
  const startCardTitle = resumeRoleplay ? `Resume ${resumeRoleplay.title}` : activeLesson.title;
  const startCardXpLabel = resumeRoleplay
    ? `+${resumeRoleplay.durationMinutes * 4} XP`
    : activeLesson.xpLabel;
  const startPreview = createHomeStartPreview({
    currentTitle: startCardTitle,
    dailyTarget,
    hasCompletedFoundation,
    hasResumeDraft: Boolean(resumeRoleplay),
    isMissionComplete,
    nextUnlockTitle: nextUnlock?.title ?? null,
    targetSessionsCompleted: localProgress.targetSessionsCompleted,
  });
  const runway = createHomeRunway({
    missionCard,
    nextUnlock: nextUnlock
      ? {
          state: nextUnlock.state,
          title: nextUnlock.title,
        }
      : null,
  });
  const latestSession = sessions[0];
  const latestCoachCue = createHomeCoachCue(latestSession);

  return (
    <ScreenContainer>
      <View style={styles.statusRow}>
        <StreakBadge label={`${mission.streakDays} day streak`} />
        <XPBadge label={`${mission.xpTotal} XP`} />
      </View>

      <View style={styles.lessonMap}>
        <AnimatedStartCard
          ctaLabel={startCardCtaLabel}
          habitLabel={startCardHabitLabel}
          habitValue={startCardHabitValue}
          levelLabel={levelProgress.currentLevelLabel}
          levelProgressLabel={levelProgress.progressLabel}
          levelProgressPercent={levelProgress.progressPercent}
          onPress={startActiveLesson}
          pathBadgeTone={startCardPathTone}
          pathKickerLabel={startCardKickerLabel}
          pathLabel={startCardPathLabel}
          preview={startPreview}
          title={startCardTitle}
          xpLabel={startCardXpLabel}
        />
        <View style={styles.runwayBox}>
          <View style={styles.runwayHeader}>
            <Text style={styles.runwayTitle}>{runway.title}</Text>
            <Badge label={runway.badgeLabel} tone={isMissionComplete ? 'success' : 'accent'} />
          </View>
          <View style={styles.runwayCardRow}>
            {runway.cards.map((card) => (
              <View key={`${card.eyebrow}-${card.title}`} style={styles.runwayCard}>
                <Text style={styles.runwayEyebrow}>{card.eyebrow}</Text>
                <Text numberOfLines={1} style={styles.runwayCardTitle}>
                  {card.title}
                </Text>
                <Text numberOfLines={2} style={styles.runwayCardBody}>
                  {card.body}
                </Text>
                {typeof card.progressPercent === 'number' ? (
                  <View style={styles.runwayProgressBox}>
                    <ProgressBar tone="success" value={card.progressPercent} />
                    <Text numberOfLines={1} style={styles.runwayProgressLabel}>
                      {card.progressLabel}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </View>

      {latestCoachCue ? (
        <View style={styles.coachCue}>
          <Badge label={latestCoachCue.badgeLabel} tone="info" />
          <Text numberOfLines={1} style={styles.coachCueText}>
            {latestCoachCue.text}
          </Text>
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
  pathBadgeTone,
  pathKickerLabel,
  pathLabel,
  preview,
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
  pathBadgeTone: 'accent' | 'secondary';
  pathKickerLabel: string;
  pathLabel: string;
  preview: {
    body: string;
    eyebrow: string;
    title: string;
  };
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
        <View
          style={[
            styles.startTarget,
            pathBadgeTone === 'accent' && styles.startTargetUnlocked,
          ]}
        >
          <Animated.View
            style={[
              styles.startRing,
              pathBadgeTone === 'accent' && styles.startRingUnlocked,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <Text
            style={[
              styles.startTargetText,
              pathBadgeTone === 'accent' && styles.startTargetTextUnlocked,
            ]}
          >
            START
          </Text>
        </View>

        <View style={styles.startCopy}>
          <View style={styles.startKickerRow}>
            <Text style={styles.startKicker}>{pathKickerLabel}</Text>
            <Badge label={pathLabel} tone={pathBadgeTone} />
          </View>
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
      <View style={styles.startPreviewBox}>
        <Text style={styles.startPreviewEyebrow}>{preview.eyebrow}</Text>
        <Text numberOfLines={1} style={styles.startPreviewTitle}>
          {preview.title}
        </Text>
        <Text numberOfLines={2} style={styles.startPreviewBody}>
          {preview.body}
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
  coachCue: {
    alignItems: 'center',
    backgroundColor: colors.coachSoft,
    borderColor: colors.primaryGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  coachCueText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    minWidth: 0,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  lessonMap: {
    gap: spacing.md,
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
  startKickerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  startMainRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  startTarget: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.secondarySoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  startTargetUnlocked: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  startRing: {
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.pill,
    height: 76,
    position: 'absolute',
    width: 76,
  },
  startRingUnlocked: {
    backgroundColor: colors.accentSoft,
  },
  startTargetText: {
    color: colors.successDark,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  startTargetTextUnlocked: {
    color: colors.accentDark,
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
  startPreviewBody: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  startPreviewBox: {
    backgroundColor: 'rgba(8, 26, 18, 0.28)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.xs,
    padding: spacing.sm,
  },
  startPreviewEyebrow: {
    color: colors.secondarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  startPreviewTitle: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xxs,
  },
  startLevelBox: {
    backgroundColor: colors.successDark,
    borderColor: colors.success,
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
    backgroundColor: colors.success,
    borderColor: colors.secondarySoft,
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
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    height: 8,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  runwayBox: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.sm,
    ...shadows.soft,
  },
  runwayCard: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    padding: spacing.sm,
  },
  runwayCardBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  runwayCardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  runwayCardTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  runwayEyebrow: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  runwayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  runwayProgressBox: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  runwayProgressLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '800',
  },
  runwayTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginRight: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
