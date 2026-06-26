import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNav } from '../components/BottomNav';
import { practiceContent } from '../data/content';
import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { RoleplayScreen } from '../screens/RoleplayScreen';
import type { DailyPracticeTarget, MainScreen, PracticeSession, RoleplayId } from '../types';

export function AppNavigator() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [activeScreen, setActiveScreen] = useState<MainScreen>('Home');
  const [selectedRoleplayId, setSelectedRoleplayId] = useState<RoleplayId>('job-interview');
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [dailyTarget, setDailyTarget] = useState<DailyPracticeTarget>(1);

  const selectedRoleplay = useMemo(
    () => practiceContent.roleplays.find((roleplay) => roleplay.id === selectedRoleplayId) ?? practiceContent.roleplays[0],
    [selectedRoleplayId],
  );

  function openRoleplay(roleplayId: RoleplayId) {
    setSelectedRoleplayId(roleplayId);
    setActiveScreen('Roleplay');
  }

  function savePracticeSession(session: PracticeSession) {
    setPracticeSessions((sessions) => [session, ...sessions].slice(0, 10));
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen onContinue={() => setHasSeenOnboarding(true)} />;
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
          <ProfileScreen dailyTarget={dailyTarget} onChangeDailyTarget={setDailyTarget} />
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
});
