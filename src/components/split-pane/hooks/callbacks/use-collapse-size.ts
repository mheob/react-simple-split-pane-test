import { Dispatch, SetStateAction, useCallback } from 'react';
import * as ReactDOM from 'react-dom';

import { moveCollapsedSiblings, moveSizes } from '../../utils';

type CollapseSizeCallbackProps = { paneIndex: number; size: number };

type CollapseSizeProps = {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  collapsedIndices: number[];
  setSizes: Dispatch<SetStateAction<number[]>>;
  setMovedSizes: Dispatch<SetStateAction<number[]>>;
  collapsedSize: number;
};

export const useCollapseSize = ({
  isReversed,
  movedSizes,
  minSizes,
  collapsedIndices,
  setSizes,
  setMovedSizes,
  collapsedSize,
}: CollapseSizeProps): (({ size, paneIndex }: CollapseSizeCallbackProps) => void) =>
  useCallback(
    ({ size, paneIndex }: CollapseSizeCallbackProps) => {
      const offset = isReversed ? -(collapsedSize - size) : collapsedSize - size;
      const index = isReversed ? paneIndex - 1 : paneIndex;
      const sizes = [...movedSizes];

      moveSizes({ sizes, index, offset, minSizes, collapsedIndices, collapsedSize });

      moveCollapsedSiblings({
        offset,
        index,
        isReversed,
        collapsedIndices,
        minSizes,
        sizes,
        collapsedSize,
      });
      ReactDOM.unstable_batchedUpdates(() => {
        setMovedSizes(sizes);
        setSizes(sizes);
      });
    },
    [isReversed, collapsedSize, movedSizes, minSizes, collapsedIndices, setMovedSizes, setSizes]
  );
