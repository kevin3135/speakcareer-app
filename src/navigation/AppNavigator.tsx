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
import type { DailyPracticeTarget, MainScreen, PracticeSession, RoleplayId } from '../types';
import { readDailyTarget, saveDailyTarget } from '../utils/dailyTargetStorage';
import { readOnboardingCompletion, saveOnboardingCompletion } from '../utils/onboardingStorage';
import { readPracticeSessions, savePracticeSessions } from '../utils/practiceSessionStorage';

export function AppNavigator() {
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [activeScreen, setActiveScreen] = useState<MainScreen>('Home');
  const [selectedRoleplayId, setSelectedRoleplayId] = useState<RoleplayId>('job-interview');
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [dailyTarget, setDailyTarget] = useState<DailyPracticeTarget>(1);

  const selectedRoleplay = useMemo(
    () => practiceContent.roleplays.find((roleplay) => roleplay.id === selectedRoleplayId) ?? practiceContent.roleplays[0],
    [selectedRoleplayId],
  );
  const shouldShowBottomNav = practiceSessions.length > 0;

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      readOnboardingCompletion(AsyncStorage),
      readDailyTarget(AsyncStorage),
      readPracticeSessions(AsyncStorage),
    ])
      .then(([isComplete, storedDailyTarget, storedPracticeSessions]) => {
        if (isMounted) {
          setHasSeenOnboarding(isComplete);
          setDailyTarget(storedDailyTarget);
          setPracticeSessions(storedPracticeSessions);
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

  function openRoleplay(roleplayId: RoleplayId) {
    setSelectedRoleplayId(roleplayId);
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

  function completeOnboarding() {
    setSelectedRoleplayId(guidedStart.roleplayId);
    setActiveScreen('Foundation');
    setHasSeenOnboarding(true);
    void saveOnboardingCompletion(AsyncStorage).catch(() => undefined);
  }

  if (isOnboardingLoading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen onContinue={completeOnboarding} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {activeScreen === 'Home' ? (
          <HomeScreen
            onStartFoundation={() => setActiveScreen('Foundation')}
            sessions={practiceSessions}
          />
        ) : null}
        {activeScreen === 'Foundation' ? (
          <FoundationScreen onStartCareerPractice={() => openRoleplay(guidedStart.roleplayId)} />
        ) : null}
        {activeScreen === 'Practice' ? (
          <PracticeScreen onOpenRoleplay={openRoleplay} sessions={practiceSessions} />
        ) : null}
        {activeScreen === 'Roleplay' ? (
          <RoleplayScreen
            key={selectedRoleplay.id}
            dailyTarget={dailyTarget}
            onOpenProgress={() => setActiveScreen('Progress')}
            onSaveSession={savePracticeSession}
            sessions={practiceSessions}
            roleplay={selectedRoleplay}
            onSelectRoleplay={openRoleplay}
          />
        ) : null}
        {activeScreen === 'Progress' ? (
          <ProgressScreen
            dailyTarget={dailyTarget}
            onOpenRoleplay={openRoleplay}
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
