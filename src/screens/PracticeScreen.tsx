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
import { createPracticeMapStats } from '../utils/practiceMapStats';
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
  const practiceMapStats = createPracticeMapStats({
    path: practiceCareerPath,
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
      subtitle="Start at the green step. Save one answer to unlock the next career conversation."
    >
      <View style={styles.statusRow}>
        {practiceMapStats.map((stat) => {
          const statusToneStyles = {
            focus: styles.statusItemFocus,
            path: styles.statusItemPath,
            reward: styles.statusItemReward,
          };

          return (
            <View key={stat.label} style={[styles.statusItem, statusToneStyles[stat.tone]]}>
              <Text style={styles.statusLabel}>{stat.label}</Text>
              <Text style={styles.statusValue}>{stat.value}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.unitBanner}>
        <View style={styles.unitCopy}>
          <Text style={styles.unitEyebrow}>Unit 1 | Career English</Text>
          <Text style={styles.unitTitle}>Professional conversation path</Text>
          <Text style={styles.unitBody}>{practiceCareerPath.body}</Text>
        </View>
        <View style={styles.unitBadge}>
          <Text style={styles.unitBadgeText}>MAP</Text>
        </View>
      </View>

      <Card>
        <View style={styles.mapHeader}>
          <View style={styles.mapTitleBlock}>
            <Text style={styles.mapKicker}>Recommended next</Text>
            <Text style={styles.mapTitle}>{practiceCareerPath.title}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>{practiceCareerPath.meta}</Text>
          </View>
        </View>
        <View style={styles.mapProgress}>
          <ProgressBar label={practiceCareerPath.progressLabel} value={practiceCareerPath.progressPercent} />
        </View>
        <View style={styles.pathBody}>
          <LearningPath
            steps={practiceCareerPath.steps.map((step) => ({
              ...step,
              onPress: () => onOpenRoleplay(step.roleplayId),
            }))}
          />
        </View>
        <View style={styles.buttonRow}>
          <AppButton
            accessibilityHint="Starts the next recommended sprint from the Practice path"
            label={practiceCareerPath.ctaLabel}
            onPress={() => onOpenRoleplay(practiceCareerPath.roleplayId)}
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
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusItem: {
    borderRadius: radii.md,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusItemFocus: {
    backgroundColor: colors.primarySoft,
  },
  statusItemPath: {
    backgroundColor: colors.infoSoft,
  },
  statusItemReward: {
    backgroundColor: colors.accentSoft,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  unitBanner: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    borderBottomWidth: 5,
    borderRadius: radii.md,
    flexDirection: 'row',
    marginTop: spacing.md,
    padding: spacing.xl,
  },
  unitCopy: {
    flex: 1,
    paddingRight: spacing.lg,
  },
  unitEyebrow: {
    color: '#DFF3EC',
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  unitTitle: {
    color: colors.surface,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: spacing.xs,
  },
  unitBody: {
    color: '#F0FBF7',
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  unitBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: radii.md,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  unitBadgeText: {
    color: colors.accentSoft,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mapHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  mapKicker: {
    color: colors.primaryDark,
    fontSize: typography.small,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  mapTitle: {
    color: colors.ink,
    fontSize: typography.h2,
    fontWeight: '900',
    marginTop: spacing.xs,
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
  mapProgress: {
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
