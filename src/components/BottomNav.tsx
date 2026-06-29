import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, shadows, spacing, typography } from '../theme';
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
    paddingTop: spacing.xs,
  },
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
    ...shadows.soft,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.lg,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  learnTab: {
    flex: 1.42,
  },
  learnTabIdle: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.primaryGlow,
    borderWidth: 1,
  },
  activeLearnTab: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  activeSecondaryTab: {
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.82,
  },
  dot: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    height: 4,
    marginBottom: spacing.xs,
    width: 20,
  },
  learnDot: {
    backgroundColor: colors.primaryGlow,
    width: 28,
  },
  activeLearnDot: {
    backgroundColor: colors.primary,
    width: 34,
  },
  activeSecondaryDot: {
    backgroundColor: colors.borderStrong,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
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
