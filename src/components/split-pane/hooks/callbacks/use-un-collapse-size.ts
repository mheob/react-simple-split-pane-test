import { Dispatch, SetStateAction, useCallback } from 'react';
import * as ReactDOM from 'react-dom';

import { moveSizes } from '../../utils';

type UnCollapseSizeCallbackProps = { paneIndex: number; size: number };

type UnCollapseSizeProps = {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  setSizes: Dispatch<SetStateAction<number[]>>;
  setMovedSizes: Dispatch<SetStateAction<number[]>>;
  collapsedSize: number;
  collapsedIndices: number[];
};

export const useUnCollapseSize = ({
  isReversed,
  movedSizes,
  minSizes,
  setMovedSizes,
  setSizes,
  collapsedSize,
  collapsedIndices,
}: UnCollapseSizeProps): (({ size, paneIndex }: UnCollapseSizeCallbackProps) => void) =>
  useCallback(
    ({ size, paneIndex }: UnCollapseSizeCallbackProps) => {
      const offset = isReversed ? -(size - 50) : size - 50;
      const index = isReversed ? paneIndex - 1 : paneIndex;
      const newSizes = [...movedSizes];
      moveSizes({ sizes: newSizes, index, offset, minSizes, collapsedSize, collapsedIndices });
      ReactDOM.unstable_batchedUpdates(() => {
        setMovedSizes(newSizes);
        setSizes(newSizes);
      });
    },
    [collapsedIndices, collapsedSize, isReversed, minSizes, movedSizes, setMovedSizes, setSizes]
  );
