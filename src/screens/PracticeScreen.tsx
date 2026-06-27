import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { LearningPath } from '../components/LearningPath';
import { ProgressBar } from '../components/ProgressBar';
import { RoleplayCard } from '../components/RoleplayCard';
import { Screen } from '../components/Screen';
import { practiceContent } from '../data/content';
import { colors, radii, spacing, typography } from '../styles/theme';
import type { PracticeSession, RoleplayId } from '../types';
import { createPracticeCareerPath } from '../utils/practiceCareerPath';
import {
  ALL_CATEGORIES_FILTER,
  ALL_LEVELS_FILTER,
  filterRoleplaysByCategory,
  filterRoleplaysByLevel,
  getRoleplayCategoryFilters,
  getRoleplayLevelFilters,
  type RoleplayCategoryFilter,
  type RoleplayLevelFilter,
} from '../utils/roleplayFilters';

type PracticeScreenProps = {
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function PracticeScreen({ onOpenRoleplay, sessions }: PracticeScreenProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<RoleplayCategoryFilter>(ALL_CATEGORIES_FILTER);
  const [selectedLevel, setSelectedLevel] = useState<RoleplayLevelFilter>(ALL_LEVELS_FILTER);
  const practiceCareerPath = createPracticeCareerPath({
    roleplays: practiceContent.roleplays,
    sessions,
  });
  const categoryFilters = getRoleplayCategoryFilters(practiceContent.roleplays);
  const levelFilters = getRoleplayLevelFilters(practiceContent.roleplays);
  const categoryFilteredRoleplays = filterRoleplaysByCategory(
    practiceContent.roleplays,
    selectedCategory,
  );
  const filteredRoleplays = filterRoleplaysByLevel(categoryFilteredRoleplays, selectedLevel);

  return (
    <Screen
      title="Practice"
      subtitle="Follow one guided English career path, then browse the full library."
    >
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroKicker}>Recommended next</Text>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>{practiceCareerPath.meta}</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>{practiceCareerPath.title}</Text>
        <Text style={styles.heroBody}>{practiceCareerPath.body}</Text>
        <View style={styles.heroProgress}>
          <ProgressBar label={practiceCareerPath.progressLabel} value={practiceCareerPath.progressPercent} />
        </View>
        <View style={styles.buttonRow}>
          <AppButton
            accessibilityHint="Starts the next recommended sprint from the Practice path"
            label={practiceCareerPath.ctaLabel}
            onPress={() => onOpenRoleplay(practiceCareerPath.roleplayId)}
          />
        </View>
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Career path</Text>
          <Text style={styles.sectionMeta}>{practiceCareerPath.progressLabel}</Text>
        </View>
        <View style={styles.pathBody}>
          <LearningPath
            steps={practiceCareerPath.steps.map((step) => ({
              ...step,
              onPress: () => onOpenRoleplay(step.roleplayId),
            }))}
          />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Scenario library</Text>
        <Text style={styles.sectionMeta}>{filteredRoleplays.length} scenarios</Text>
      </View>
      <Text style={styles.filterLabel}>Category</Text>
      <View style={styles.filterRow}>
        {categoryFilters.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <Pressable
              accessibilityHint="Filters the roleplay list by career conversation category"
              accessibilityLabel={`Set category filter to ${category}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={({ pressed }) => [
                styles.filterChip,
                isActive && styles.filterChipActive,
                pressed && styles.filterChipPressed,
              ]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.filterLabel}>Level</Text>
      <View style={styles.filterRow}>
        {levelFilters.map((level) => {
          const isActive = level === selectedLevel;

          return (
            <Pressable
              accessibilityHint="Filters the roleplay list by English level"
              accessibilityLabel={`Set level filter to ${level}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              key={level}
              onPress={() => setSelectedLevel(level)}
              style={({ pressed }) => [
                styles.filterChip,
                isActive && styles.filterChipActive,
                pressed && styles.filterChipPressed,
              ]}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{level}</Text>
            </Pressable>
          );
        })}
      </View>
      {filteredRoleplays.map((roleplay) => (
        <RoleplayCard
          key={roleplay.id}
          roleplay={roleplay}
          onPress={() => onOpenRoleplay(roleplay.id)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#F0F8F4',
    borderColor: '#B7DED3',
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  heroHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metaPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  metaPillText: {
    color: colors.ink,
    fontSize: typography.small,
    fontWeight: '900',
  },
  heroTitle: {
    color: colors.ink,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: spacing.sm,
  },
  heroBody: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  heroProgress: {
    marginTop: spacing.lg,
  },
  buttonRow: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  pathBody: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  filterLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipPressed: {
    opacity: 0.82,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  filterTextActive: {
    color: colors.surface,
  },
});
