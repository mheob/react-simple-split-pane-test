import { useMemo } from 'react';

import { Direction, SplitType } from '../../index';

export const useIsLtr = ({ split, dir }: { dir?: Direction; split: SplitType }): boolean =>
  useMemo(() => (split === 'vertical' ? dir !== 'rtl' : true), [split, dir]);
