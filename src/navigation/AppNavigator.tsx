import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BottomNav } from '../components/BottomNav';
import { practiceContent } from '../data/content';
import { guidedStart } from '../data/guidedIntro';
import { FoundationScreen } from '../screens/FoundationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { RoleplayScreen } from '../screens/RoleplayScreen';
import { colors } from '../styles/theme';
import type {
  DailyPracticeTarget,
  MainScreen,
  PracticeSession,
  RoleplayId,
  RoleplayWarmupCue,
  StartingLevelId,
} from '../types';
import { readDailyTarget, saveDailyTarget } from '../utils/dailyTargetStorage';
import {
  FOUNDATION_TOTAL_STEPS,
  readFoundationProgress,
  saveFoundationProgress,
} from '../utils/foundationProgressStorage';
import { readPracticedMistakeIds, savePracticedMistakeIds } from '../utils/mistakePracticeStorage';
import { readOnboardingCompletion, saveOnboardingCompletion } from '../utils/onboardingStorage';
import { readPracticeSessions, savePracticeSessions } from '../utils/practiceSessionStorage';
import { createFoundationWarmupCue } from '../utils/roleplayWarmupCue';
import { getStartingLevelProfile } from '../utils/startingLevel';
import { readStartingLevel, saveStartingLevel } from '../utils/startingLevelStorage';

export function AppNavigator() {
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [activeScreen, setActiveScreen] = useState<MainScreen>('Home');
  const [selectedRoleplayId, setSelectedRoleplayId] = useState<RoleplayId>('job-interview');
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [practicedMistakeIds, setPracticedMistakeIds] = useState<string[]>([]);
  const [dailyTarget, setDailyTarget] = useState<DailyPracticeTarget>(1);
  const [startingLevelId, setStartingLevelId] = useState<StartingLevelId>('basic');
  const [foundationCompletedSteps, setFoundationCompletedSteps] = useState(0);
  const [roleplayWarmupCue, setRoleplayWarmupCue] = useState<RoleplayWarmupCue | null>(null);

  const selectedRoleplay = useMemo(
    () => practiceContent.roleplays.find((roleplay) => roleplay.id === selectedRoleplayId) ?? practiceContent.roleplays[0],
    [selectedRoleplayId],
  );
  const shouldShowBottomNav =
    practiceSessions.length > 0 &&
    !['Foundation', 'Roleplay'].includes(activeScreen);
  const startingLevelProfile = getStartingLevelProfile(startingLevelId);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      readOnboardingCompletion(AsyncStorage),
      readDailyTarget(AsyncStorage),
      readPracticeSessions(AsyncStorage),
      readPracticedMistakeIds(AsyncStorage),
      readStartingLevel(AsyncStorage),
      readFoundationProgress(AsyncStorage, FOUNDATION_TOTAL_STEPS),
    ])
      .then(([
        isComplete,
        storedDailyTarget,
        storedPracticeSessions,
        storedPracticedMistakeIds,
        storedStartingLevel,
        storedFoundationProgress,
      ]) => {
        if (isMounted) {
          setHasSeenOnboarding(isComplete);
          setDailyTarget(storedDailyTarget);
          setPracticeSessions(storedPracticeSessions);
          setPracticedMistakeIds(storedPracticedMistakeIds);
          setStartingLevelId(storedStartingLevel);
          setFoundationCompletedSteps(storedFoundationProgress);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsOnboardingLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function openRoleplay(roleplayId: RoleplayId, warmupCue?: RoleplayWarmupCue) {
    const hasSavedInterview = practiceSessions.some((session) => session.roleplayId === guidedStart.roleplayId);
    const shouldUseFoundationCue =
      !warmupCue &&
      roleplayId === guidedStart.roleplayId &&
      foundationCompletedSteps >= FOUNDATION_TOTAL_STEPS &&
      !hasSavedInterview;
    const nextWarmupCue = shouldUseFoundationCue
      ? createFoundationWarmupCue({
        coachNote: startingLevelProfile.coachMessage,
        starterAnswer: startingLevelProfile.starterAnswer,
      })
      : warmupCue ?? null;

    setSelectedRoleplayId(roleplayId);
    setRoleplayWarmupCue(nextWarmupCue);
    setActiveScreen('Roleplay');
  }

  function savePracticeSession(session: PracticeSession) {
    setPracticeSessions((sessions) => {
      const nextSessions = [session, ...sessions].slice(0, 10);

      void savePracticeSessions(AsyncStorage, nextSessions).catch(() => undefined);

      return nextSessions;
    });
  }

  function changeDailyTarget(target: DailyPracticeTarget) {
    setDailyTarget(target);
    void saveDailyTarget(AsyncStorage, target).catch(() => undefined);
  }

  function markMistakePracticed(mistakeId: string) {
    setPracticedMistakeIds((currentIds) => {
      if (currentIds.includes(mistakeId)) {
        return currentIds;
      }

      const nextIds = [...currentIds, mistakeId];

      void savePracticedMistakeIds(AsyncStorage, nextIds).catch(() => undefined);

      return nextIds;
    });
  }

  function completeOnboarding(
    selectedLevel: StartingLevelId,
    selectedDailyTarget: DailyPracticeTarget,
  ) {
    setSelectedRoleplayId(guidedStart.roleplayId);
    setActiveScreen('Foundation');
    setHasSeenOnboarding(true);
    setDailyTarget(selectedDailyTarget);
    setStartingLevelId(selectedLevel);
    setFoundationCompletedSteps(0);
    void saveOnboardingCompletion(AsyncStorage).catch(() => undefined);
    void saveDailyTarget(AsyncStorage, selectedDailyTarget).catch(() => undefined);
    void saveStartingLevel(AsyncStorage, selectedLevel).catch(() => undefined);
    void saveFoundationProgress(AsyncStorage, 0, FOUNDATION_TOTAL_STEPS).catch(() => undefined);
  }

  function updateFoundationProgress(completedSteps: number) {
    setFoundationCompletedSteps(completedSteps);
    void saveFoundationProgress(AsyncStorage, completedSteps, FOUNDATION_TOTAL_STEPS).catch(() => undefined);
  }

  if (isOnboardingLoading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen dailyTarget={dailyTarget} onContinue={completeOnboarding} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {activeScreen === 'Home' ? (
          <HomeScreen
            dailyTarget={dailyTarget}
            foundationCompletedSteps={foundationCompletedSteps}
            onOpenRoleplay={openRoleplay}
            onStartFoundation={() => setActiveScreen('Foundation')}
            sessions={practiceSessions}
          />
        ) : null}
        {activeScreen === 'Foundation' ? (
          <FoundationScreen
            initialCompletedSteps={foundationCompletedSteps}
            onBack={() => setActiveScreen('Home')}
            onProgressChange={updateFoundationProgress}
            onStartCareerPractice={() =>
              openRoleplay(
                guidedStart.roleplayId,
                createFoundationWarmupCue({
                  coachNote: startingLevelProfile.coachMessage,
                  starterAnswer: startingLevelProfile.starterAnswer,
                }),
              )
            }
            startingLevelId={startingLevelId}
          />
        ) : null}
        {activeScreen === 'Practice' ? (
          <PracticeScreen onOpenRoleplay={openRoleplay} sessions={practiceSessions} />
        ) : null}
        {activeScreen === 'Roleplay' ? (
          <RoleplayScreen
            key={`${selectedRoleplay.id}:${roleplayWarmupCue?.cueId ?? 'default'}`}
            dailyTarget={dailyTarget}
            onBack={() => setActiveScreen('Home')}
            onOpenProgress={() => setActiveScreen('Progress')}
            onSaveSession={savePracticeSession}
            onSelectRoleplay={openRoleplay}
            roleplay={selectedRoleplay}
            sessions={practiceSessions}
            startingLevelId={startingLevelId}
            warmupCue={roleplayWarmupCue}
          />
        ) : null}
        {activeScreen === 'Progress' ? (
          <ProgressScreen
            dailyTarget={dailyTarget}
            onMarkMistakePracticed={markMistakePracticed}
            onOpenRoleplay={openRoleplay}
            practicedMistakeIds={practicedMistakeIds}
            sessions={practiceSessions}
          />
        ) : null}
        {activeScreen === 'Profile' ? (
          <ProfileScreen dailyTarget={dailyTarget} onChangeDailyTarget={changeDailyTarget} />
        ) : null}
      </View>
      {shouldShowBottomNav ? (
        <BottomNav
          activeScreen={activeScreen === 'Foundation' ? 'Home' : activeScreen}
          onChange={setActiveScreen}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
});
