import { useCallback } from 'react';

import { getReferenceSize } from '../../utils';
import { SplitType } from '../..';
import { ChildPane } from '../use-split-pane-resize';

export const useGetCurrentPaneSizes = ({
  childPanes,
  split,
}: {
  childPanes: Pick<ChildPane, 'ref'>[];
  split: SplitType;
}): (() => number[]) =>
  useCallback(
    () => childPanes.map(({ ref }): number => getReferenceSize({ split, ref })),
    [childPanes, split]
  );
