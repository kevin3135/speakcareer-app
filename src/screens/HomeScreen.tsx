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
import { createHomeLearnState } from '../utils/homeLearnState';
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
  const learnState = createHomeLearnState({
    foundationCtaLabel: foundationStart.ctaLabel,
    foundationTitle: foundationStart.title,
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const guidedRoleplayId: RoleplayId =
    learnState.hero.target === 'foundation' ? 'job-interview' : learnState.hero.target;
  const homeLibrary = createHomeLibraryState(
    sessions,
    practiceContent.roleplays,
    guidedRoleplayId,
  );
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
        subtitle="Follow the one card marked Now. The rest stay visible, but quieter."
        title="Your path"
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
      <Card tone="muted">
        <Text style={styles.previewLessonsLabel}>Later on this path</Text>
        <View style={styles.previewLessonsList}>
          {previewLessons.map((lesson, index) => (
            <View key={lesson.title} style={styles.previewLessonRow}>
              <View style={styles.previewLessonNumber}>
                <Text style={styles.previewLessonNumberText}>
                  {String(index >= activeLessonIndex ? index + 2 : index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.previewLessonCopy}>
                <View style={styles.previewLessonTitleRow}>
                  <Text style={styles.previewLessonTitle}>{lesson.title}</Text>
                  <Badge
                    label={lesson.state === 'completed' ? 'Done' : 'Locked'}
                    tone={lesson.state === 'completed' ? 'secondary' : 'purple'}
                  />
                </View>
                <Text style={styles.previewLessonMeta}>{lesson.meta}</Text>
                <Text style={styles.previewLessonBody}>{lesson.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

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
  previewLessonsLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  previewLessonsList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  previewLessonRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  previewLessonNumber: {
    alignItems: 'center',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 42,
  },
  previewLessonNumberText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  previewLessonCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  previewLessonTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  previewLessonTitle: {
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  previewLessonMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  previewLessonBody: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
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
