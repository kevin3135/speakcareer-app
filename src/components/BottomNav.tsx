import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../theme';
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
    <View style={styles.shell}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isLearnTab = tab.screen === 'Home';
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
              style={({ pressed }) => [
                styles.tab,
                isLearnTab && styles.learnTab,
                isLearnTab && !isActive && styles.learnTabIdle,
                isActive && !isLearnTab && styles.activeSecondaryTab,
                isActive && isLearnTab && styles.activeLearnTab,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.dot,
                  isLearnTab && styles.learnDot,
                  isActive && !isLearnTab && styles.activeSecondaryDot,
                  isActive && isLearnTab && styles.activeLearnDot,
                ]}
              />
              <Text
                style={[
                  styles.label,
                  isLearnTab && styles.learnLabel,
                  isActive && !isLearnTab && styles.activeSecondaryLabel,
                  isActive && isLearnTab && styles.activeLearnLabel,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xxs,
  },
  container: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xxs,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.md,
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  learnTab: {
    flex: 1.28,
  },
  learnTabIdle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  activeLearnTab: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryGlow,
    borderWidth: 1,
  },
  activeSecondaryTab: {
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.82,
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    height: 3,
    marginBottom: spacing.xs,
    width: 16,
  },
  learnDot: {
    backgroundColor: colors.primaryGlow,
    width: 24,
  },
  activeLearnDot: {
    backgroundColor: colors.primary,
    width: 30,
  },
  activeSecondaryDot: {
    backgroundColor: colors.borderStrong,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  learnLabel: {
    color: colors.primaryDark,
  },
  activeLearnLabel: {
    color: colors.primaryDark,
  },
  activeSecondaryLabel: {
    color: colors.text,
  },
});
