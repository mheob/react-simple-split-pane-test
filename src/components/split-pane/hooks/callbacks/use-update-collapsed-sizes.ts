import { Dispatch, SetStateAction, useCallback } from 'react';

import { Nullable, SplitPaneHooks } from '../..';
import { useCollapseSize } from './use-collapse-size';
import { useUnCollapseSize } from './use-un-collapse-size';

type UpdateCollapsedSizesProps = {
  movedSizes: number[];
  collapsedSizes: Nullable<number>[];
  sizes: number[];
  collapseSize: ReturnType<typeof useCollapseSize>;
  unCollapseSize: ReturnType<typeof useUnCollapseSize>;
  setCollapsedSizes: Dispatch<SetStateAction<Nullable<number>[]>>;
  hooks?: SplitPaneHooks;
};

export const useUpdateCollapsedSizes = ({
  movedSizes,
  setCollapsedSizes,
  collapsedSizes,
  collapseSize,
  sizes,
  hooks,
  unCollapseSize,
}: UpdateCollapsedSizesProps): ((indices: number[]) => void) =>
  useCallback(
    (indices: number[]) => {
      setCollapsedSizes(
        collapsedSizes.map((size, index) => {
          const isCollapsed = indices.includes(index);
          if (isCollapsed && size === null) {
            collapseSize({ size: sizes[index], paneIndex: index });
            hooks?.onChange?.(sizes);
            return movedSizes[index]; // when collapsed store current size
          }
          if (!isCollapsed && size !== null) {
            unCollapseSize({ paneIndex: index, size }); // when un-collapsed clear size: ;
            hooks?.onChange?.(sizes);
            return 0;
          }
          return size;
        })
      );
    },
    [collapseSize, collapsedSizes, hooks, movedSizes, setCollapsedSizes, sizes, unCollapseSize]
  );
