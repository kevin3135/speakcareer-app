import { StyleSheet, Text, View } from 'react-native';

import {
  Badge,
  Card,
  GradientButton,
  GradientHero,
  LessonCard,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { foundationStart } from '../data/guidedIntro';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';
import { createHomeLibraryState } from '../utils/homeLibrary';

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
  const hasSavedPractice = sessions.length > 0;
  const recommendedRoleplay =
    practiceContent.roleplays.find((roleplay) => roleplay.id === (hasSavedPractice ? 'meeting-practice' : 'job-interview')) ??
    practiceContent.roleplays[0];
  const homeLibrary = createHomeLibraryState(sessions, practiceContent.roleplays, recommendedRoleplay.id);
  const startToday = hasSavedPractice
    ? () => onOpenRoleplay(recommendedRoleplay.id)
    : onStartFoundation;
  const todayStep = hasSavedPractice
    ? {
        eyebrow: 'Next quest',
        title: recommendedRoleplay.title,
        body: 'Answer one workplace prompt and save one better version.',
        cta: 'Start next roleplay',
      }
    : {
        eyebrow: 'Step 1',
        title: foundationStart.title,
        body: 'Tap three blocks: I, action, result. Then the interview unlocks.',
        cta: 'Start step 1',
      };

  const lessonPath = [
    {
      body: 'Learn the sentence shape that makes work English clear.',
      meta: '2 min foundation',
      state: hasSavedPractice ? 'completed' as const : 'current' as const,
      title: 'Clear sentence',
      xpLabel: '+20 XP',
      onPress: hasSavedPractice ? undefined : onStartFoundation,
    },
    {
      body: 'Use the same shape in a real interview answer.',
      meta: '5 min roleplay',
      state: hasSavedPractice ? 'current' as const : 'locked' as const,
      title: 'Interview answer',
      xpLabel: '+40 XP',
      onPress: hasSavedPractice ? () => onOpenRoleplay('job-interview') : undefined,
    },
    {
      body: 'Give a short update without rambling.',
      meta: 'Unlocks after interview',
      state: sessions.some((session) => session.roleplayId === 'meeting-practice')
        ? 'completed' as const
        : 'locked' as const,
      title: 'Meeting update',
      xpLabel: '+45 XP',
    },
  ];

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
        overline={todayStep.eyebrow}
        subtitle={todayStep.body}
        title={todayStep.title}
        tone="primary"
      >
        <View>
          <GradientButton label={todayStep.cta} onPress={startToday} />
        </View>
      </GradientHero>

      <View style={styles.badgeRow}>
        <XPBadge label={`${mission.xpTotal} XP`} />
        <XPBadge label={`Level ${mission.level}`} />
      </View>

      {hasSavedPractice ? (
        <Card tone="strong">
          <View style={styles.questHeader}>
            <View style={styles.questIcon}>
              <Text style={styles.questIconText}>1</Text>
            </View>
            <View style={styles.questCopy}>
              <Text style={styles.questKicker}>Today</Text>
              <Text style={styles.questTitle}>{mission.title}</Text>
              <Text style={styles.questBody}>One short lesson is enough for your streak.</Text>
            </View>
            <XPBadge label={mission.rewardLabel} />
          </View>
          <View style={styles.questProgress}>
            <ProgressBar label="Daily goal" value={mission.progressPercent} tone="secondary" />
          </View>
        </Card>
      ) : null}

      <SectionHeader
        subtitle="Follow the active card. Locked lessons show what comes next."
        title="Your path"
      />
      {lessonPath.map((lesson, index) => (
        <LessonCard
          body={lesson.body}
          index={index + 1}
          key={lesson.title}
          meta={lesson.meta}
          onPress={lesson.onPress}
          state={lesson.state}
          title={lesson.title}
          xpLabel={lesson.xpLabel}
        />
      ))}

      <SectionHeader
        action={<Badge label={homeLibrary.meta} tone="info" />}
        subtitle="See what opens next without adding another button to press."
        title={homeLibrary.title}
      />
      <Card tone="muted">
        <Text style={styles.unlockBody}>{homeLibrary.body}</Text>
        <View style={styles.unlockList}>
          {homeLibrary.previewRoleplays.map((roleplay, index) => {
            const statusLabel = hasSavedPractice && index === 0 ? 'Next' : 'Locked';

            return (
              <View key={roleplay.id} style={styles.unlockRow}>
                <View style={styles.unlockCopy}>
                  <View style={styles.unlockTitleRow}>
                    <Text style={styles.unlockTitle}>{roleplay.title}</Text>
                    <Badge
                      label={statusLabel}
                      tone={hasSavedPractice && index === 0 ? 'secondary' : 'purple'}
                    />
                  </View>
                  <Text style={styles.unlockMeta}>
                    {roleplay.category} | {roleplay.targetLevel}
                  </Text>
                  <Text style={styles.unlockFocus}>{roleplay.focus}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  questHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  questIcon: {
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    height: 46,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 46,
  },
  questIconText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  questCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  questKicker: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  questTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  questBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  questProgress: {
    marginTop: spacing.lg,
  },
  unlockBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
  },
  unlockList: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  unlockRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  unlockCopy: {
    gap: spacing.xs,
  },
  unlockTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  unlockTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  unlockMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  unlockFocus: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
});
