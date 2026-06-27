import { Children, type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing, typography } from '../styles/theme';

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function Screen({ title, subtitle, children }: ScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {Children.map(children, (child, index) => (
        <View style={index === 0 ? styles.firstItem : styles.item}>{child}</View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.rounded,
    fontSize: typography.h1,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.rounded,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  firstItem: {
    marginTop: 0,
  },
  item: {
    marginTop: spacing.lg,
  },
});
