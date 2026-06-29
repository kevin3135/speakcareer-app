import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  AppButton,
  Badge,
  Card,
  GradientHero,
  ProgressBar,
  RoleplayCard,
  ScreenContainer,
  SectionHeader,
} from '../components/ui';
import { practiceContent } from '../data/content';
import { colors, fonts, spacing, typography } from '../theme';
import type { PracticeSession, RoleplayDraft, RoleplayId } from '../types';
import { createPracticeLibraryState } from '../utils/practiceLibraryState';

type PracticeScreenProps = {
  draft: RoleplayDraft | null;
  onOpenRoleplay: (roleplayId: RoleplayId) => void;
  sessions: PracticeSession[];
};

export function PracticeScreen({ draft, onOpenRoleplay, sessions }: PracticeScreenProps) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const libraryState = createPracticeLibraryState({
    draft,
    roleplays: practiceContent.roleplays,
    sessions,
  });

  return (
    <ScreenContainer
      overline="Practice library"
      subtitle={libraryState.isResumeMode
        ? 'Finish the saved answer first. The rest of the library stays available when you want a different focus.'
        : 'One recommended conversation first. Open the full library only when you want a different focus.'}
      title="Practice path"
    >
      <GradientHero
        overline={libraryState.isResumeMode ? 'Saved draft' : 'Recommended next'}
        subtitle={libraryState.subtitle}
        title={libraryState.title}
        tone="primary"
      >
        <Card style={styles.heroProgressCard} tone="dark">
          <View style={styles.heroProgressHeader}>
            <Text style={styles.heroProgressLabel}>Career path</Text>
            <Badge label={libraryState.meta} tone="accent" />
          </View>
          <ProgressBar
            label={libraryState.progressLabel}
            tone="accent"
            value={libraryState.progressPercent}
          />
        </Card>
      </GradientHero>

      <SectionHeader
        subtitle={libraryState.isResumeMode
          ? 'Return to the unfinished answer now so the app keeps one clear next step.'
          : 'Stay in sequence when you want the clearest next action.'}
        title="Do this now"
      />

      <RoleplayCard
        category={libraryState.recommendedCard.categoryLabel}
        ctaLabel={libraryState.recommendedCard.ctaLabel}
        description={libraryState.recommendedCard.description}
        difficulty={libraryState.recommendedCard.difficulty}
        focus={libraryState.recommendedCard.focus}
        onPress={() => onOpenRoleplay(libraryState.recommendedCard.roleplayId)}
        time={libraryState.recommendedCard.time}
        title={libraryState.recommendedCard.title}
        xp={libraryState.recommendedCard.xp}
      />

      <SectionHeader
        action={libraryState.browseCards.length > 0 ? (
          <AppButton
            accessibilityHint={isLibraryOpen
              ? 'Hide the rest of the practice library'
              : 'Show the rest of the practice library'}
            label={isLibraryOpen ? 'Hide list' : 'Show list'}
            onPress={() => setIsLibraryOpen((isOpen) => !isOpen)}
            size="small"
            variant="quiet"
          />
        ) : undefined}
        subtitle={libraryState.isResumeMode
          ? 'Open this only if you want to leave the saved answer for later and practice a different work situation.'
          : 'Use this only when you want to break sequence and practice another work situation.'}
        title="Full library"
      />

      {libraryState.browseCards.length > 0 ? (
        isLibraryOpen ? (
          libraryState.browseCards.map((card) => (
            <RoleplayCard
              category={card.categoryLabel}
              ctaLabel={card.ctaLabel}
              description={card.description}
              difficulty={card.difficulty}
              focus={card.focus}
              key={card.id}
              onPress={() => onOpenRoleplay(card.roleplayId)}
              time={card.time}
              title={card.title}
              xp={card.xp}
            />
          ))
        ) : (
          <Card tone="muted">
            <Text style={styles.libraryKicker}>Hidden by default</Text>
            <Text style={styles.libraryTitle}>{libraryState.browseLabel}</Text>
            <Text style={styles.libraryBody}>
              {libraryState.isResumeMode
                ? 'Finish the saved answer first. Open the rest only when you want a different career conversation.'
                : 'Keep the next action simple first. Open the rest when you want a different career conversation.'}
            </Text>
          </Card>
        )
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroProgressCard: {
    backgroundColor: 'rgba(12, 26, 42, 0.38)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    padding: spacing.md,
  },
  heroProgressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  heroProgressLabel: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  libraryBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.sm,
  },
  libraryKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  libraryTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h3,
    fontWeight: '900',
    lineHeight: typography.lineH3,
    marginTop: spacing.xs,
  },
});
