import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Nullable, SplitType } from './index';

export const DEFAULT_MIN_SIZE = 50;

export const getMinSize = (index: number, minSizes?: number | number[]): number => {
  if (typeof minSizes === 'number') {
    if (minSizes > 0) {
      return minSizes;
    }
  } else if (Array.isArray(minSizes)) {
    const value = minSizes[index];
    if (value > 0) {
      return value;
    }
  }
  return DEFAULT_MIN_SIZE;
};

export const getReferenceSize = ({
  ref,
  split,
}: {
  split: SplitType;
  ref: React.RefObject<HTMLDivElement>;
}): number => {
  const sizeAttribute = split === 'vertical' ? 'width' : 'height';
  return ref.current?.getBoundingClientRect()[sizeAttribute] ?? 0;
};

export type MoveDetails = {
  sizes: number[];
  index: number;
  offset: number;
  minSizes: number[];
  collapsedIndices: number[];
  collapsedSize: number;
};

/**
 * Mutates the original array in a recursive fashion, identifying the current sizes, whether they need to be changed, and whether they need to push the next or previous pane.
 */
export const moveSizes = ({
  index,
  minSizes,
  offset,
  sizes,
  collapsedIndices,
  collapsedSize,
}: MoveDetails): number => {
  //recursion break points
  if (!offset || index < 0 || index + 1 >= sizes.length) return 0;

  const isCollapsed = (index_: number) => collapsedIndices.includes(index_);
  const firstMinSize = isCollapsed(index) ? collapsedSize : getMinSize(index, minSizes);
  const secondMinSize = isCollapsed(index + 1) ? collapsedSize : getMinSize(index + 1, minSizes);
  const firstSize = sizes[index] + offset;
  const secondSize = sizes[index + 1] - offset;

  if (offset < 0 && firstSize < firstMinSize) {
    const missing = firstSize - firstMinSize;
    const pushedOffset = moveSizes({
      sizes,
      index: index - 1,
      offset: missing,
      minSizes,
      collapsedIndices,
      collapsedSize,
    });

    offset -= missing - pushedOffset;
  } else if (offset > 0 && secondSize < secondMinSize) {
    const missing = secondMinSize - secondSize;
    const pushedOffset = moveSizes({
      sizes,
      index: index + 1,
      offset: missing,
      minSizes,
      collapsedIndices,
      collapsedSize,
    });

    offset -= missing - pushedOffset;
  }
  sizes[index] += offset;
  sizes[index + 1] -= offset;

  return offset;
};

type MoveCollapsedDetails = {
  offset: number;
  isReversed: boolean;
  index: number;
  sizes: number[];
  collapsedIndices: number[];
  minSizes: number[];
  collapsedSize: number;
};

/**
 * This is only used when a collapse action is invoked.  It's meant to move any collapsed siblings along with the move.
 */
export const moveCollapsedSiblings = ({
  offset,
  isReversed,
  collapsedIndices,
  minSizes,
  sizes,
  index,
  collapsedSize,
}: MoveCollapsedDetails): void => {
  if (isReversed ? offset > 0 : offset < 0) {
    for (
      let index_ = isReversed ? index : index + 1;
      isReversed ? index_ > 0 : index_ < sizes.length - 1;
      isReversed ? index_-- : index_++
    ) {
      if (collapsedIndices.includes(index_)) {
        moveSizes({
          sizes,
          index: isReversed ? index_ - 1 : index_,
          offset,
          minSizes,
          collapsedIndices,
          collapsedSize,
        });
      }
    }
  }
};

const verticalCss = css`
  left: 0;
  right: 0;
  flex-direction: row;
`;
const horizontalCss = css`
  bottom: 0;
  top: 0;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
`;
export const Wrapper = styled.div<{ split: SplitType }>`
  display: flex;
  flex: 1;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  ${(props) => (props.split === 'vertical' ? verticalCss : horizontalCss)}
`;

/**
 * Infers the indices of the collapsed panels from an array of nullable collapse sizes.  If the index is null then it's not collapsed.
 */
export const convertCollapseSizesToIndices = (sizes?: Nullable<number>[]): number[] =>
  sizes?.reduce(
    (previous, current, index) => (current !== null ? [...previous, index] : [...previous]),
    [] as number[]
  ) ?? [];

export const addArray = (array: number[]): number =>
  array.reduce((previous, current) => previous + current, 0);

/**
 * Returns a debounced version of a function. Similar to lodash's _.debounce
 * @param func the function to be debounced
 * @param waitFor the amount of time that must elapse before the debounce expires and the callback is called.
 */
export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => ReturnType<F>) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    // eslint-disable-next-line testing-library/await-async-utils
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};
