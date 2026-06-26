import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../styles/theme';
import type { MainScreen } from '../types';

const tabs: MainScreen[] = ['Home', 'Practice', 'Roleplay', 'Progress', 'Profile'];

type BottomNavProps = {
  activeScreen: MainScreen;
  onChange: (screen: MainScreen) => void;
};

export function BottomNav({ activeScreen, onChange }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab === activeScreen;

        return (
          <Pressable
            accessibilityHint={`Open the ${tab} screen`}
            accessibilityLabel={`${tab} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={tab}
            onPress={() => onChange(tab)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <View style={[styles.indicator, isActive && styles.activeIndicator]} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab}</Text>
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
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
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
    fontSize: 11,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.primaryDark,
  },
});
