import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../styles/theme';

export type LearningPathStep = {
  id: string;
  title: string;
  caption: string;
  state: 'done' | 'active' | 'locked';
  xpLabel?: string;
  onPress?: () => void;
};

type LearningPathProps = {
  steps: LearningPathStep[];
};

export function LearningPath({ steps }: LearningPathProps) {
  return (
    <View>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isInteractive = Boolean(step.onPress) && step.state !== 'locked';
        const content = (
          <>
            <View style={styles.rail}>
              <View style={[styles.node, styles[`${step.state}Node`]]}>
                <Text style={[styles.nodeText, step.state === 'locked' && styles.lockedNodeText]}>
                  {index + 1}
                </Text>
              </View>
              {!isLast ? <View style={[styles.line, step.state === 'done' && styles.doneLine]} /> : null}
            </View>
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, step.state === 'locked' && styles.lockedText]}>
                  {step.title}
                </Text>
                {step.xpLabel ? <Text style={styles.xp}>{step.xpLabel}</Text> : null}
              </View>
              <Text style={[styles.caption, step.state === 'locked' && styles.lockedText]}>
                {step.caption}
              </Text>
              <Text style={[styles.stateLabel, styles[`${step.state}Label`]]}>
                {stateLabels[step.state]}
              </Text>
            </View>
          </>
        );

        const stepStyle = [
          styles.step,
          step.state === 'active' && styles.activeStep,
        ];

        if (isInteractive) {
          return (
            <Pressable
              accessibilityHint="Opens the next recommended practice"
              accessibilityLabel={`${step.title}. ${stateLabels[step.state]} step`}
              accessibilityRole="button"
              key={step.id}
              onPress={step.onPress}
              style={({ pressed }) => [
                ...stepStyle,
                pressed && styles.pressed,
              ]}
            >
              {content}
            </Pressable>
          );
        }

        return (
          <View
            key={step.id}
            style={stepStyle}
          >
            {content}
          </View>
        );
      })}
    </View>
  );
}

const stateLabels = {
  active: 'NEXT',
  done: 'DONE',
  locked: 'LOCKED',
};

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  activeStep: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.84,
  },
  rail: {
    alignItems: 'center',
    width: 42,
  },
  node: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  doneNode: {
    backgroundColor: colors.primary,
  },
  activeNode: {
    backgroundColor: colors.accent,
  },
  lockedNode: {
    backgroundColor: colors.border,
  },
  nodeText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '900',
  },
  lockedNodeText: {
    color: colors.textMuted,
  },
  line: {
    backgroundColor: colors.border,
    flex: 1,
    marginTop: spacing.xs,
    minHeight: 28,
    width: 3,
  },
  doneLine: {
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '900',
  },
  xp: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
    marginLeft: spacing.md,
  },
  caption: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  stateLabel: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  doneLabel: {
    color: colors.primaryDark,
  },
  activeLabel: {
    color: colors.accent,
  },
  lockedLabel: {
    color: colors.textMuted,
  },
  lockedText: {
    color: colors.textMuted,
  },
});
