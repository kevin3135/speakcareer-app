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

const stateLabels = {
  active: 'START',
  done: 'DONE',
  locked: 'LOCKED',
};

export function LearningPath({ steps }: LearningPathProps) {
  return (
    <View style={styles.map}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isInteractive = Boolean(step.onPress) && step.state !== 'locked';
        const isRight = index % 2 === 1;
        const rowContent = (
          <>
            <View style={styles.nodeStack}>
              {step.state === 'active' ? (
                <View style={styles.startBubble}>
                  <Text style={styles.startBubbleText}>START</Text>
                </View>
              ) : null}
              <View style={[styles.nodeShadow, nodeShadowStyles[step.state]]}>
                <View style={[styles.nodeTop, nodeTopStyles[step.state]]}>
                  <Text
                    style={[
                      styles.nodeText,
                      step.state === 'locked' && styles.lockedNodeText,
                    ]}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.copyPanel,
                isRight && styles.copyPanelRight,
                step.state === 'active' && styles.copyPanelActive,
                step.state === 'locked' && styles.copyPanelLocked,
              ]}
            >
              <View style={styles.copyHeader}>
                <Text style={[styles.title, step.state === 'locked' && styles.lockedText]}>
                  {step.title}
                </Text>
                {step.xpLabel ? (
                  <Text style={[styles.xp, step.state === 'locked' && styles.lockedText]}>
                    {step.xpLabel}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.caption, step.state === 'locked' && styles.lockedText]}>
                {step.caption}
              </Text>
              <Text style={[styles.statePill, statePillStyles[step.state]]}>
                {stateLabels[step.state]}
              </Text>
            </View>
          </>
        );

        return (
          <View key={step.id} style={styles.stepBlock}>
            {isInteractive ? (
              <Pressable
                accessibilityHint="Opens this unlocked career practice step"
                accessibilityLabel={`${step.title}. ${stateLabels[step.state]} step`}
                accessibilityRole="button"
                onPress={step.onPress}
                style={({ pressed }) => [
                  styles.stepContent,
                  isRight && styles.stepContentRight,
                  pressed && styles.pressed,
                ]}
              >
                {rowContent}
              </Pressable>
            ) : (
              <View style={[styles.stepContent, isRight && styles.stepContentRight]}>
                {rowContent}
              </View>
            )}
            {!isLast ? (
              <View
                style={[
                  styles.connector,
                  step.state === 'done' ? styles.connectorDone : styles.connectorMuted,
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    paddingVertical: spacing.sm,
  },
  stepBlock: {
    width: '100%',
  },
  stepContent: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  stepContentRight: {
    flexDirection: 'row-reverse',
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  nodeStack: {
    alignItems: 'center',
    width: 84,
  },
  startBubble: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 2,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  startBubbleText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '900',
  },
  nodeShadow: {
    alignItems: 'center',
    borderRadius: 999,
    height: 78,
    justifyContent: 'flex-start',
    paddingTop: 4,
    width: 78,
    elevation: 3,
    shadowColor: colors.ink,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  activeNodeShadow: {
    backgroundColor: '#0D744F',
  },
  doneNodeShadow: {
    backgroundColor: '#063F38',
  },
  lockedNodeShadow: {
    backgroundColor: '#B9C2CA',
  },
  nodeTop: {
    alignItems: 'center',
    borderRadius: 999,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  activeNodeTop: {
    backgroundColor: '#2AC96F',
    borderColor: colors.accentSoft,
    borderWidth: 3,
  },
  doneNodeTop: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.accent,
    borderWidth: 3,
  },
  lockedNodeTop: {
    backgroundColor: '#E5EAF0',
  },
  nodeText: {
    color: colors.surface,
    fontSize: typography.h2,
    fontWeight: '900',
  },
  lockedNodeText: {
    color: '#97A1AB',
  },
  copyPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    marginLeft: spacing.md,
    padding: spacing.md,
  },
  copyPanelRight: {
    marginLeft: 0,
    marginRight: spacing.md,
  },
  copyPanelActive: {
    backgroundColor: colors.primarySoft,
    borderColor: '#9FD8C7',
  },
  copyPanelLocked: {
    backgroundColor: '#F3F6F8',
    borderColor: '#E0E6EB',
  },
  copyHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: 20,
  },
  xp: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '900',
    marginLeft: spacing.sm,
  },
  caption: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  statePill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '900',
    marginTop: spacing.sm,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activeStatePill: {
    backgroundColor: colors.surface,
    color: colors.primaryDark,
  },
  doneStatePill: {
    backgroundColor: colors.primaryDark,
    color: colors.surface,
  },
  lockedStatePill: {
    backgroundColor: '#E2E7EC',
    color: '#6F7B86',
  },
  connector: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 28,
    marginVertical: spacing.xs,
    width: 5,
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
  connectorMuted: {
    backgroundColor: colors.border,
  },
  lockedText: {
    color: colors.textMuted,
  },
});

const nodeShadowStyles = {
  active: styles.activeNodeShadow,
  done: styles.doneNodeShadow,
  locked: styles.lockedNodeShadow,
};

const nodeTopStyles = {
  active: styles.activeNodeTop,
  done: styles.doneNodeTop,
  locked: styles.lockedNodeTop,
};

const statePillStyles = {
  active: styles.activeStatePill,
  done: styles.doneStatePill,
  locked: styles.lockedStatePill,
};
