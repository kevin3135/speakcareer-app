import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BottomNav } from '../components/BottomNav';
import { practiceContent } from '../data/content';
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

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      readOnboardingCompletion(AsyncStorage),
      readDailyTarget(AsyncStorage),
    ])
      .then(([isComplete, storedDailyTarget]) => {
        if (isMounted) {
          setHasSeenOnboarding(isComplete);
          setDailyTarget(storedDailyTarget);
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
    setPracticeSessions((sessions) => [session, ...sessions].slice(0, 10));
  }

  function changeDailyTarget(target: DailyPracticeTarget) {
    setDailyTarget(target);
    void saveDailyTarget(AsyncStorage, target).catch(() => undefined);
  }

  function completeOnboarding() {
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
            dailyTarget={dailyTarget}
            onOpenRoleplay={openRoleplay}
            sessions={practiceSessions}
          />
        ) : null}
        {activeScreen === 'Practice' ? <PracticeScreen onOpenRoleplay={openRoleplay} /> : null}
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
      <BottomNav activeScreen={activeScreen} onChange={setActiveScreen} />
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
