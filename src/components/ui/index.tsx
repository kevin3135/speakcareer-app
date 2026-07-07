import type { ReactNode } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, shadows, spacing, typography } from '../../theme';

type ChildrenProps = {
  children?: ReactNode;
};

type Tone = 'primary' | 'secondary' | 'accent' | 'success' | 'info' | 'purple';
type LessonState = 'current' | 'completed' | 'locked';

const toneStyles = {
  accent: {
    background: colors.accentSoft,
    border: colors.accent,
    text: colors.accentDark,
  },
  info: {
    background: colors.infoSoft,
    border: colors.info,
    text: colors.infoDark,
  },
  primary: {
    background: colors.primarySoft,
    border: colors.primary,
    text: colors.primaryDark,
  },
  purple: {
    background: colors.purpleSoft,
    border: colors.purple,
    text: colors.purpleDark,
  },
  secondary: {
    background: colors.secondarySoft,
    border: colors.secondary,
    text: colors.secondaryDark,
  },
  success: {
    background: colors.successSoft,
    border: colors.success,
    text: colors.successDark,
  },
};

export function ScreenContainer({
  children,
  overline,
  right,
  subtitle,
  title,
}: ChildrenProps & {
  overline?: string;
  right?: ReactNode;
  subtitle?: string;
  title?: string;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent} style={styles.screen}>
      {title ? (
        <AppHeader
          overline={overline}
          right={right}
          subtitle={subtitle}
          title={title}
        />
      ) : null}
      <View style={styles.stack}>{children}</View>
    </ScrollView>
  );
}

export function AppHeader({
  overline,
  right,
  subtitle,
  title,
}: {
  overline?: string;
  right?: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        {overline ? <Text style={styles.overline}>{overline}</Text> : null}
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.headerRight}>{right}</View> : null}
    </View>
  );
}

export function GradientHero({
  children,
  overline,
  subtitle,
  title,
  tone = 'primary',
}: ChildrenProps & {
  overline?: string;
  subtitle?: string;
  title: string;
  tone?: Tone;
}) {
  const toneStyle = toneStyles[tone];

  return (
    <View style={[styles.hero, { backgroundColor: toneStyle.border }]}>
      <View style={[styles.heroGlow, { backgroundColor: toneStyle.background }]} />
      <View style={styles.heroContent}>
        {overline ? <Text style={styles.heroOverline}>{overline}</Text> : null}
        <Text style={styles.heroTitle}>{title}</Text>
        {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
        {children ? <View style={styles.heroChildren}>{children}</View> : null}
      </View>
    </View>
  );
}

export function AppButton({
  accessibilityHint,
  accessibilityLabel,
  disabled = false,
  label,
  onPress,
  size = 'large',
  variant = 'primary',
}: {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  size?: 'large' | 'small';
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
}) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'small' && styles.buttonSmall,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'quiet' && styles.buttonQuiet,
        variant === 'danger' && styles.buttonDanger,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant === 'primary' && styles.buttonPrimaryLabel,
          variant === 'danger' && styles.buttonPrimaryLabel,
          variant !== 'primary' && variant !== 'danger' && styles.buttonSecondaryLabel,
          size === 'small' && styles.buttonSmallLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function GradientButton(props: Omit<Parameters<typeof AppButton>[0], 'variant'>) {
  return <AppButton {...props} variant="primary" />;
}

export function Card({
  children,
  style,
  tone = 'default',
}: ChildrenProps & {
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'muted' | 'strong' | 'dark' | 'accent';
}) {
  return (
    <View
      style={[
        styles.card,
        tone === 'muted' && styles.cardMuted,
        tone === 'strong' && styles.cardStrong,
        tone === 'dark' && styles.cardDark,
        tone === 'accent' && styles.cardAccent,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function XPBadge({ label }: { label: string }) {
  return <Badge label={label} tone="accent" />;
}

export function StreakBadge({ label }: { label: string }) {
  return <Badge label={label} tone="success" />;
}

export function LevelBadge({ label }: { label: string }) {
  return <Badge label={label} tone="purple" />;
}

export function Badge({ label, tone = 'primary' }: { label: string; tone?: Tone }) {
  const toneStyle = toneStyles[tone];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: toneStyle.background, borderColor: toneStyle.border },
      ]}
    >
      <Text style={[styles.badgeText, { color: toneStyle.text }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({
  label,
  tone = 'primary',
  value,
}: {
  label?: string;
  tone?: Tone;
  value: number;
}) {
  const width = `${Math.max(0, Math.min(value, 100))}%` as DimensionValue;
  const toneStyle = toneStyles[tone];

  return (
    <View>
      {label ? (
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>{Math.round(value)}%</Text>
        </View>
      ) : null}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: toneStyle.border, width }]} />
      </View>
    </View>
  );
}

export function LessonCard({
  body,
  ctaLabel,
  index,
  meta,
  onPress,
  state,
  title,
  xpLabel,
}: {
  body: string;
  ctaLabel?: string;
  index: number;
  meta: string;
  onPress?: () => void;
  state: LessonState;
  title: string;
  xpLabel?: string;
}) {
  const isLocked = state === 'locked';
  const isCurrent = state === 'current';
  const stateLabel = state === 'completed' ? 'Done' : isCurrent ? 'Now' : 'Locked';

  return (
    <Pressable
      accessibilityHint={isLocked ? 'This lesson unlocks later' : 'Starts this lesson'}
      accessibilityLabel={`${title}. ${stateLabel}`}
      accessibilityRole={onPress && !isLocked ? 'button' : 'text'}
      disabled={!onPress || isLocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.lessonCard,
        isCurrent && styles.lessonCardCurrent,
        state === 'completed' && styles.lessonCardCompleted,
        isLocked && styles.lessonCardLocked,
        pressed && styles.buttonPressed,
      ]}
    >
      <View
        style={[
          styles.lessonNode,
          isCurrent && styles.lessonNodeCurrent,
          state === 'completed' && styles.lessonNodeCompleted,
          isLocked && styles.lessonNodeLocked,
        ]}
      >
        <Text style={[styles.lessonNodeText, isLocked && styles.lessonNodeTextLocked]}>
          {String(index).padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.lessonCopy}>
        <View style={styles.lessonHeader}>
          <Text style={[styles.lessonState, isLocked && styles.lessonTextLocked]}>{stateLabel}</Text>
          {xpLabel ? <XPBadge label={xpLabel} /> : null}
        </View>
        <Text style={[styles.lessonTitle, isLocked && styles.lessonTextLocked]}>{title}</Text>
        <Text style={[styles.lessonBody, isLocked && styles.lessonTextLocked]}>{body}</Text>
        <Text style={[styles.lessonMeta, isLocked && styles.lessonTextLocked]}>{meta}</Text>
        {ctaLabel && !isLocked ? <Text style={styles.lessonCta}>{ctaLabel}</Text> : null}
      </View>
    </Pressable>
  );
}

export function DailyQuestCard({
  body,
  ctaLabel,
  onPress,
  progress,
  reward,
  title,
}: {
  body: string;
  ctaLabel: string;
  onPress: () => void;
  progress: number;
  reward: string;
  title: string;
}) {
  return (
    <Card tone="strong">
      <View style={styles.rowBetween}>
        <View style={styles.flexOne}>
          <Text style={styles.cardKicker}>Daily quest</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <XPBadge label={reward} />
      </View>
      <Text style={styles.cardBody}>{body}</Text>
      <View style={styles.cardProgress}>
        <ProgressBar value={progress} tone="secondary" />
      </View>
      <View style={styles.cardAction}>
        <GradientButton label={ctaLabel} onPress={onPress} />
      </View>
    </Card>
  );
}

export function CoachBubble({ label = 'Career coach', message }: { label?: string; message: string }) {
  return (
    <View style={styles.coachRow}>
      <View style={styles.coachAvatar}>
        <View style={styles.coachAvatarCore}>
          <Text style={styles.coachAvatarText}>SC</Text>
        </View>
      </View>
      <View style={styles.coachBubble}>
        <View style={styles.coachLabelRow}>
          <Text style={styles.coachLabel}>{label}</Text>
          <Badge label="Guide" tone="secondary" />
        </View>
        <Text style={styles.coachMessage}>{message}</Text>
      </View>
    </View>
  );
}

export function RoleplayCard({
  category,
  ctaLabel = 'Start',
  description,
  difficulty,
  focus,
  onPress,
  time,
  title,
  xp,
}: {
  category: string;
  ctaLabel?: string;
  description: string;
  difficulty: string;
  focus: string;
  onPress: () => void;
  time: string;
  title: string;
  xp: string;
}) {
  return (
    <Pressable
      accessibilityHint={`Starts ${title}`}
      accessibilityLabel={`${title}, ${difficulty}, ${time}, ${xp}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.roleplayCard, pressed && styles.buttonPressed]}
    >
      <View style={styles.rowBetween}>
        <View style={styles.flexOne}>
          <Text style={styles.roleplayCategory}>{category}</Text>
          <Text style={styles.roleplayTitle}>{title}</Text>
        </View>
        <XPBadge label={xp} />
      </View>
      <Text style={styles.roleplayFocus}>{focus}</Text>
      <Text style={styles.roleplayDescription}>{description}</Text>
      <View style={styles.roleplayFooter}>
        <LevelBadge label={difficulty} />
        <Badge label={time} tone="info" />
        <Text style={styles.roleplayCta}>{ctaLabel}</Text>
      </View>
    </Pressable>
  );
}

export function FeedbackCard({
  correctedVersion,
  explanation,
  onRetry,
  onSaveMistake,
  scores,
  strongerVersion,
  summary,
  toImprove,
  wentWell,
}: {
  correctedVersion: string;
  explanation: string;
  onRetry: () => void;
  onSaveMistake: () => void;
  scores: { label: string; value: number }[];
  strongerVersion: string;
  summary: string;
  toImprove: string[];
  wentWell: string[];
}) {
  const overallScore = Math.round(scores.reduce((total, score) => total + score.value, 0) / scores.length);

  return (
    <Card tone="strong">
      <View style={styles.feedbackScoreHeader}>
        <View>
          <Text style={styles.cardKicker}>Coach feedback</Text>
          <Text style={styles.cardTitle}>Overall score</Text>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{overallScore}</Text>
          <Text style={styles.scoreLabel}>/100</Text>
        </View>
      </View>
      <Text style={styles.cardBody}>{summary}</Text>
      <View style={styles.scoreGrid}>
        {scores.map((score) => (
          <View key={score.label} style={styles.scoreItem}>
            <ProgressBar label={score.label} value={score.value} tone="primary" />
          </View>
        ))}
      </View>
      <View style={styles.feedbackColumns}>
        <View style={styles.feedbackColumn}>
          <Text style={styles.feedbackColumnTitle}>What went well</Text>
          {wentWell.map((item) => (
            <Text key={item} style={styles.feedbackBullet}>- {item}</Text>
          ))}
        </View>
        <View style={styles.feedbackColumn}>
          <Text style={styles.feedbackColumnTitle}>Improve next</Text>
          {toImprove.map((item) => (
            <Text key={item} style={styles.feedbackBullet}>- {item}</Text>
          ))}
        </View>
      </View>
      <View style={styles.correctionBox}>
        <Text style={styles.correctionLabel}>Corrected version</Text>
        <Text style={styles.correctionText}>{correctedVersion}</Text>
      </View>
      <View style={styles.strongerBox}>
        <Text style={styles.correctionLabel}>Stronger professional version</Text>
        <Text style={styles.correctionText}>{strongerVersion}</Text>
      </View>
      <Text style={styles.explanation}>{explanation}</Text>
      <View style={styles.doubleAction}>
        <View style={styles.doubleActionItem}>
          <AppButton label="Retry" onPress={onRetry} variant="secondary" />
        </View>
        <View style={styles.doubleActionItem}>
          <AppButton label="Save mistake" onPress={onSaveMistake} />
        </View>
      </View>
    </Card>
  );
}

export function MistakeCard({
  category,
  correction,
  explanation,
  onPractice,
  original,
  repeatedCount,
}: {
  category: string;
  correction: string;
  explanation: string;
  onPractice: () => void;
  original: string;
  repeatedCount: number;
}) {
  return (
    <Card>
      <View style={styles.rowBetween}>
        <Badge label={category} tone="info" />
        <Badge label={`${repeatedCount}x seen`} tone="accent" />
      </View>
      <View style={styles.mistakeBlock}>
        <Text style={styles.mistakeLabel}>Instead of</Text>
        <Text style={styles.mistakeOriginal}>{original}</Text>
      </View>
      <View style={styles.mistakeCorrection}>
        <Text style={styles.mistakeLabelStrong}>Say this</Text>
        <Text style={styles.mistakeText}>{correction}</Text>
      </View>
      <Text style={styles.explanation}>{explanation}</Text>
      <View style={styles.cardAction}>
        <AppButton label="Practice again" onPress={onPractice} variant="secondary" />
      </View>
    </Card>
  );
}

export function SkillProgressCard({
  label,
  tone = 'primary',
  value,
}: {
  label: string;
  tone?: Tone;
  value: number;
}) {
  return (
    <Card style={styles.skillCard}>
      <Text style={styles.skillValue}>{value}%</Text>
      <Text style={styles.skillLabel}>{label}</Text>
      <View style={styles.cardProgress}>
        <ProgressBar value={value} tone={tone} />
      </View>
    </Card>
  );
}

export function PremiumCard({
  benefits,
  onPress,
  subtitle,
  title,
}: {
  benefits: string[];
  onPress?: () => void;
  subtitle: string;
  title: string;
}) {
  const featuredBenefits = benefits.slice(0, 2);
  const supportBenefits = benefits.slice(2);

  return (
    <Card style={styles.premiumCard} tone="dark">
      <View style={styles.premiumHeader}>
        <View style={styles.premiumHeaderLeft}>
          <View style={styles.premiumIcon}>
            <Text style={styles.premiumIconText}>PRO</Text>
          </View>
          <View style={styles.premiumHeadingCopy}>
            <Text style={styles.premiumKicker}>Career momentum</Text>
            <Text style={styles.premiumHeaderNote}>Practice first</Text>
          </View>
        </View>
        <Badge label="Preview" tone="accent" />
      </View>
      <Text style={styles.premiumTitle}>{title}</Text>
      <Text style={styles.premiumSubtitle}>{subtitle}</Text>

      <View style={styles.premiumAnchorRow}>
        <View style={styles.premiumAnchorPill}>
          <Text style={styles.premiumAnchorText}>Core path now</Text>
        </View>
        <View style={styles.premiumAnchorPill}>
          <Text style={styles.premiumAnchorText}>Deeper coach later</Text>
        </View>
      </View>

      {featuredBenefits.length ? (
        <View style={styles.premiumPreviewRail}>
          {featuredBenefits.map((benefit, index) => (
            <View key={benefit} style={styles.premiumPreviewTile}>
              <View style={styles.premiumPreviewTileHeader}>
                <Text style={styles.premiumPreviewNumber}>0{index + 1}</Text>
                <View style={styles.premiumPreviewSignal} />
              </View>
              <Text style={styles.premiumPreviewText}>{benefit}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {supportBenefits.length ? (
        <View style={styles.premiumBenefits}>
          {supportBenefits.map((benefit) => (
            <View key={benefit} style={styles.premiumBenefitRow}>
              <View style={styles.premiumBenefitMark} />
              <Text style={styles.premiumBenefit}>{benefit}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.premiumFooterCue}>
        <Text style={styles.premiumFooterCueText}>
          Free practice stays first. Pro stays a later coaching layer.
        </Text>
      </View>

      {onPress ? (
        <View style={styles.cardAction}>
          <AppButton label="View future benefits" onPress={onPress} variant="secondary" />
        </View>
      ) : null}
    </Card>
  );
}

export function EmptyState({
  body,
  ctaLabel,
  onPress,
  title,
}: {
  body: string;
  ctaLabel?: string;
  onPress?: () => void;
  title: string;
}) {
  return (
    <Card tone="muted">
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
      {ctaLabel && onPress ? (
        <View style={styles.cardAction}>
          <AppButton label={ctaLabel} onPress={onPress} />
        </View>
      ) : null}
    </Card>
  );
}

export function SectionHeader({
  action,
  subtitle,
  title,
}: {
  action?: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.flexOne}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screenContent: {
    backgroundColor: colors.background,
    flexGrow: 1,
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
  },
  stack: {
    gap: spacing.lg,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  headerRight: {
    marginTop: spacing.xs,
  },
  overline: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: typography.lineH1,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  hero: {
    borderRadius: radius.xl,
    minHeight: 188,
    overflow: 'hidden',
    padding: spacing.xl,
    ...shadows.medium,
  },
  heroGlow: {
    borderRadius: radius.pill,
    height: 170,
    opacity: 0.28,
    position: 'absolute',
    right: -58,
    top: -52,
    width: 170,
  },
  heroContent: {
    position: 'relative',
  },
  heroOverline: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    opacity: 0.86,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.title,
    fontWeight: '900',
    lineHeight: typography.lineTitle,
    marginTop: spacing.sm,
  },
  heroSubtitle: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
    opacity: 0.92,
  },
  heroChildren: {
    marginTop: spacing.lg,
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.xl,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonSmall: {
    borderRadius: radius.lg,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    borderBottomWidth: 5,
    ...shadows.button,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.borderStrong,
    borderBottomWidth: 4,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    ...shadows.soft,
  },
  buttonQuiet: {
    backgroundColor: colors.surfaceMuted,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
    borderBottomColor: colors.dangerDark,
    borderBottomWidth: 5,
    ...shadows.button,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ translateY: 2 }, { scale: 0.99 }],
  },
  buttonLabel: {
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    textAlign: 'center',
  },
  buttonSmallLabel: {
    fontSize: typography.small,
  },
  buttonPrimaryLabel: {
    color: colors.white,
  },
  buttonSecondaryLabel: {
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    ...shadows.soft,
  },
  cardMuted: {
    backgroundColor: colors.surfaceMuted,
  },
  cardStrong: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
  },
  cardDark: {
    backgroundColor: colors.navy,
    borderColor: colors.primaryDark,
  },
  cardAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  badge: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
  },
  progressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
  },
  progressValue: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  progressTrack: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.pill,
    height: 11,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: radius.pill,
    height: 11,
  },
  lessonCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xl,
    ...shadows.soft,
  },
  lessonCardCurrent: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  lessonCardCompleted: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  lessonCardLocked: {
    backgroundColor: colors.lockedSoft,
    borderColor: colors.border,
  },
  lessonNode: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    borderBottomWidth: 5,
    borderRadius: radius.pill,
    height: 62,
    justifyContent: 'center',
    marginRight: spacing.lg,
    width: 62,
    ...shadows.node,
  },
  lessonNodeCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderWidth: 4,
  },
  lessonNodeCompleted: {
    backgroundColor: colors.success,
    borderBottomColor: colors.successDark,
  },
  lessonNodeLocked: {
    backgroundColor: colors.locked,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  lessonNodeText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  lessonNodeTextLocked: {
    color: colors.lockedSoft,
  },
  lessonCopy: {
    flex: 1,
  },
  lessonHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lessonState: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  lessonTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  lessonBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  lessonMeta: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  lessonTextLocked: {
    color: colors.textMuted,
  },
  lessonCta: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  rowBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexOne: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cardKicker: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  cardTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    lineHeight: typography.lineH2,
    marginTop: spacing.xs,
  },
  cardBody: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  cardProgress: {
    marginTop: spacing.lg,
  },
  cardAction: {
    marginTop: spacing.lg,
  },
  coachRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  coachAvatar: {
    alignItems: 'center',
    backgroundColor: colors.coachSoft,
    borderColor: colors.primaryGlow,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 54,
    ...shadows.soft,
  },
  coachAvatarCore: {
    alignItems: 'center',
    backgroundColor: colors.coach,
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  coachAvatarText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  coachBubble: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.primaryGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.soft,
  },
  coachLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  coachLabel: {
    color: colors.coach,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  coachMessage: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  roleplayCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.soft,
  },
  roleplayCategory: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  roleplayTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  roleplayFocus: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  roleplayDescription: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  roleplayFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  roleplayCta: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginLeft: 'auto',
  },
  feedbackScoreHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  scoreValue: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  scoreLabel: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  scoreGrid: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  scoreItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  feedbackColumns: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  feedbackColumn: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  feedbackColumnTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '900',
  },
  feedbackBullet: {
    color: colors.text,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
  correctionBox: {
    backgroundColor: colors.correctionSoft,
    borderColor: colors.correction,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  strongerBox: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  correctionLabel: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  correctionText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  explanation: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    lineHeight: typography.lineSmall,
    marginTop: spacing.md,
  },
  doubleAction: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  doubleActionItem: {
    flex: 1,
  },
  mistakeBlock: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  mistakeCorrection: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  mistakeLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeLabelStrong: {
    color: colors.secondaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  mistakeOriginal: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  mistakeText: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: typography.lineBody,
    marginTop: spacing.xs,
  },
  skillCard: {
    flex: 1,
  },
  skillValue: {
    color: colors.primary,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  skillLabel: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  premiumCard: {
    overflow: 'hidden',
  },
  premiumKicker: {
    color: colors.accent,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  premiumHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  premiumHeaderLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  premiumIcon: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  premiumIconText: {
    color: colors.navy,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  premiumHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  premiumHeaderNote: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
    marginTop: spacing.xxs,
  },
  premiumTitle: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
    lineHeight: typography.lineH1,
    marginTop: spacing.xs,
  },
  premiumSubtitle: {
    color: colors.primarySoft,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: typography.lineBody,
    marginTop: spacing.md,
  },
  premiumAnchorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  premiumAnchorPill: {
    backgroundColor: colors.scrim,
    borderColor: colors.primaryDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  premiumAnchorText: {
    color: colors.accentSoft,
    fontFamily: fonts.rounded,
    fontSize: typography.micro,
    fontWeight: '900',
  },
  premiumPreviewRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  premiumPreviewTile: {
    backgroundColor: colors.scrim,
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 96,
    minWidth: 136,
    padding: spacing.md,
  },
  premiumPreviewTileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  premiumPreviewNumber: {
    color: colors.accent,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
  },
  premiumPreviewSignal: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 10,
    width: 34,
  },
  premiumPreviewText: {
    color: colors.white,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
    marginTop: spacing.sm,
  },
  premiumBenefits: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  premiumBenefitRow: {
    alignItems: 'center',
    backgroundColor: colors.scrim,
    borderColor: colors.primaryDark,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  premiumBenefitMark: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  premiumBenefit: {
    color: colors.white,
    flex: 1,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '800',
    lineHeight: typography.lineSmall,
  },
  premiumFooterCue: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  premiumFooterCueText: {
    color: colors.primaryDark,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '900',
    lineHeight: typography.lineSmall,
  },
  emptyTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: typography.lineSmall,
    marginTop: spacing.xs,
  },
});
