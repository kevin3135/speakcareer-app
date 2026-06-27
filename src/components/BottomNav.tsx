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
                isActive && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.dot, isActive && styles.activeDot]} />
              <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
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
  activeTab: {
    backgroundColor: colors.primarySoft,
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
  activeDot: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  activeLabel: {
    color: colors.primaryDark,
  },
});
