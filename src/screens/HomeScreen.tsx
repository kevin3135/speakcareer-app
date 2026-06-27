import { StyleSheet, View } from 'react-native';

import {
  DailyQuestCard,
  GradientButton,
  GradientHero,
  LessonCard,
  RoleplayCard,
  ScreenContainer,
  SectionHeader,
  StreakBadge,
  XPBadge,
} from '../components/ui';
import { practiceContent, progressData } from '../data/content';
import { foundationStart } from '../data/guidedIntro';
import { spacing } from '../theme';
import type { DailyPracticeTarget, PracticeSession, RoleplayId } from '../types';
import { createDailyMission } from '../utils/gamification';

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
  const startToday = hasSavedPractice
    ? () => onOpenRoleplay(recommendedRoleplay.id)
    : onStartFoundation;

  const lessonPath = [
    {
      body: 'Learn the sentence shape that makes work English clear.',
      ctaLabel: hasSavedPractice ? undefined : 'Start here',
      meta: '2 min foundation',
      state: hasSavedPractice ? 'completed' as const : 'current' as const,
      title: 'Clear sentence',
      xpLabel: '+20 XP',
      onPress: hasSavedPractice ? undefined : onStartFoundation,
    },
    {
      body: 'Use the same shape in a real interview answer.',
      ctaLabel: hasSavedPractice ? 'Continue' : undefined,
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
        overline="Today's practice"
        subtitle="Build one confident workplace answer and unlock the next lesson."
        title={hasSavedPractice ? 'Keep your streak alive' : foundationStart.title}
        tone="primary"
      >
        <View>
          <GradientButton label="Start today's practice" onPress={startToday} />
        </View>
      </GradientHero>

      <View style={styles.badgeRow}>
        <XPBadge label={`${mission.xpTotal} XP`} />
        <XPBadge label={`Level ${mission.level}`} />
      </View>

      <DailyQuestCard
        body="Finish one guided practice and bank a useful correction."
        ctaLabel="Start quest"
        onPress={startToday}
        progress={mission.progressPercent}
        reward={mission.rewardLabel}
        title={mission.title}
      />

      <SectionHeader
        subtitle="Follow the active card. Locked lessons show what comes next."
        title="Your path"
      />
      {lessonPath.map((lesson, index) => (
        <LessonCard
          body={lesson.body}
          ctaLabel={lesson.ctaLabel}
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
        subtitle="The next conversation the coach will guide."
        title="Recommended roleplay"
      />
      <RoleplayCard
        category={recommendedRoleplay.category}
        ctaLabel="Start"
        description={recommendedRoleplay.description}
        difficulty={recommendedRoleplay.targetLevel}
        focus={recommendedRoleplay.focus}
        onPress={() => onOpenRoleplay(recommendedRoleplay.id)}
        time={`${recommendedRoleplay.durationMinutes} min`}
        title={recommendedRoleplay.title}
        xp={`+${recommendedRoleplay.durationMinutes * 4} XP`}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
