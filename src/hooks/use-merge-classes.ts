import { useMemo } from 'react';

export const useMergeClasses = (classes: (string | undefined)[]): string =>
  useMemo(() => classes.filter((cls) => cls).join(' '), [classes]);
