import { Dispatch, SetStateAction, useCallback } from 'react';

export const useToggleCollapse = ({
  collapsedIndices,
  setCollapsed,
}: {
  collapsedIndices: number[];
  setCollapsed: Dispatch<SetStateAction<number[]>>;
}): ((index: number) => void) =>
  useCallback(
    (index: number) => {
      collapsedIndices.includes(index)
        ? setCollapsed(collapsedIndices.filter((index_) => index_ !== index))
        : setCollapsed([...collapsedIndices, index]);
    },
    [collapsedIndices, setCollapsed]
  );
