import { useMemo } from 'react';

import { CollapseOptions } from '../../index';
import { DEFAULT_MIN_SIZE, getMinSize } from '../../utils';

/**
 * Returns the current actual minimum size of the panel.  This in some cases means the collapsed size.
 */
export const useMinSizes = ({
  minSizes,
  numSizes,
  collapsedIndices,
  collapseOptions,
}: {
  numSizes: number;
  minSizes?: number | number[];
  collapsedIndices: number[];
  collapseOptions?: CollapseOptions;
}): number[] =>
  useMemo(
    () =>
      Array.from({ length: numSizes }).map((_child, index) =>
        collapsedIndices.includes(index)
          ? collapseOptions?.collapsedSize ?? DEFAULT_MIN_SIZE
          : getMinSize(index, minSizes)
      ),
    [numSizes, collapseOptions, collapsedIndices, minSizes]
  );
