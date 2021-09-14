import { Dispatch, SetStateAction, useCallback } from 'react';

import { addArray } from '../../utils';

type RecalculateOptions = {
  getCurrentPaneSizes: () => number[];
  collapsedIndices: number[];
  collapsedSize: number;
  originalMinSizes: number | number[] | undefined;
  minSizes: number[];
  setMovedSizes: Dispatch<SetStateAction<number[]>>;
  setSizes: Dispatch<SetStateAction<number[]>>;
};

export const useRecalculateSizes = ({
  getCurrentPaneSizes,
  collapsedSize,
  collapsedIndices,
  setMovedSizes,
  setSizes,
}: RecalculateOptions): ((initialSizes?: number[]) => void) =>
  useCallback(
    (initialSizes?: number[]) => {
      const currentSizes = getCurrentPaneSizes();
      const ratio =
        initialSizes && initialSizes.length > 0
          ? addArray(currentSizes) / addArray(initialSizes)
          : 1;
      const initialRatioSizes = initialSizes
        ? initialSizes.map((size) => size * ratio)
        : currentSizes;
      const adjustedSizes = initialRatioSizes.map((size, index_) => {
        if (collapsedIndices.includes(index_)) {
          return collapsedSize;
        }
        if (collapsedIndices.includes(index_ - 1)) {
          const totalPreviousSizeToAdd = addArray(
            collapsedIndices
              .filter((_collapsedIndex, index) => index <= index_)
              .map((_index, index) => initialRatioSizes[index] - collapsedSize)
          );
          return size + totalPreviousSizeToAdd;
        }
        return size;
      });
      setMovedSizes(adjustedSizes);
      setSizes(adjustedSizes);
    },
    [collapsedIndices, collapsedSize, getCurrentPaneSizes, setMovedSizes, setSizes]
  );
