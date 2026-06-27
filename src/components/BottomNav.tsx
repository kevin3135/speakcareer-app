import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '../styles/theme';
import type { MainScreen } from '../types';

type BottomTab = {
  label: string;
  screen: MainScreen;
};

const tabs: BottomTab[] = [
  { label: 'Learn', screen: 'Home' },
  { label: 'Wins', screen: 'Progress' },
  { label: 'Me', screen: 'Profile' },
];

type BottomNavProps = {
  activeScreen: MainScreen;
  onChange: (screen: MainScreen) => void;
};

export function BottomNav({ activeScreen, onChange }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          tab.screen === activeScreen ||
          (tab.screen === 'Home' && ['Foundation', 'Practice', 'Roleplay'].includes(activeScreen));

        return (
          <Pressable
            accessibilityHint={`Open ${tab.label}`}
            accessibilityLabel={`${tab.label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={tab.screen}
            onPress={() => onChange(tab.screen)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <View style={[styles.indicator, isActive && styles.activeIndicator]} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radii.md,
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  activeTab: {
    backgroundColor: colors.primarySoft,
  },
  indicator: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    height: 3,
    marginBottom: spacing.xs,
    width: 22,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: 12,
    fontWeight: '900',
  },
  activeLabel: {
    color: colors.primaryDark,
  },
});
