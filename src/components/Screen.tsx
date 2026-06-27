import type { PropsWithChildren } from 'react';

import { ScreenContainer } from './ui';

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function Screen({ children, subtitle, title }: ScreenProps) {
  return (
    <ScreenContainer subtitle={subtitle} title={title}>
      {children}
    </ScreenContainer>
  );
}
