import { ReactChild, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useEventListener } from '../../../hooks/use-event-listener';
import { CollapseOptions, Nullable, SplitPaneProps } from '../index';
import { debounce } from '../utils';
import { useCollapseSize } from './callbacks/use-collapse-size';
import { useGetCurrentPaneSizes } from './callbacks/use-get-current-pane-sizes';
import { useGetMovedSizes } from './callbacks/use-get-moved-sizes';
import { useHandleDragFinished } from './callbacks/use-handle-drag-finished';
import { useHandleDragStart } from './callbacks/use-handle-drag-start';
import { useRecalculateSizes } from './callbacks/use-recalculate-sizes';
import { useUnCollapseSize } from './callbacks/use-un-collapse-size';
import { useUpdateCollapsedSizes } from './callbacks/use-update-collapsed-sizes';
import { BeginDragCallback, useDragState } from './effects/use-drag-state';
import { useChildPanes } from './memos/use-child-panes';
import { useCollapsedSize } from './memos/use-collapsed-size';
import { useIsCollapseReversed } from './memos/use-is-collapse-reversed';
import { useMinSizes } from './memos/use-min-sizes';

export type ChildPane = {
  node: ReactChild;
  ref: RefObject<HTMLDivElement>;
  key: string;
  size: number;
};
type SplitPaneResizeReturns = {
  childPanes: ChildPane[];
  resizingIndex: Nullable<number>;
  handleDragStart: BeginDragCallback;
};

type SplitPaneResizeOptions = Pick<
  SplitPaneProps,
  'split' | 'initialSizes' | 'hooks' | 'collapsedSizes' | 'minSizes'
> & {
  collapsedIndices: number[];
  isLtr: boolean;
  collapseOptions?: CollapseOptions;
  children: ReactChild[];
  isVertical: boolean;
};

/**
 * Manages the dragging, size calculation, collapse calculation, and general state management of the
 * panes.
 * It propagates the results of its complex calculations into the `childPanes` which are used by the
 * rest of the "dumb" react components that just take all of them and render them
 */
export const useSplitPaneResize = ({
  children: originalChildren,
  split,
  initialSizes: originalDefaults,
  minSizes: originalMinSizes,
  hooks,
  collapsedIndices,
  collapsedSizes: originalCollapsedSizes,
  collapseOptions,
  isVertical,
  isLtr,
}: SplitPaneResizeOptions): SplitPaneResizeReturns => {
  const children = useMemo(
    () => (!Array.isArray(originalChildren) ? [originalChildren] : originalChildren),
    [originalChildren]
  );
  // VALUES: const values used throughout the different logic
  const paneReferences = useRef(new Map<string, RefObject<HTMLDivElement>>());

  const minSizes = useMinSizes({
    minSizes: originalMinSizes,
    numSizes: children.length,
    collapseOptions,
    collapsedIndices,
  });
  const collapsedSize = useCollapsedSize({ collapseOptions });
  const childPanes = useChildPanes({ minSizes, children, paneRefs: paneReferences });
  const isReversed = useIsCollapseReversed(collapseOptions);
  const initialSizes = useMemo(
    () => children.map((_c, index) => originalDefaults?.[index] ?? 1),
    [children, originalDefaults]
  );

  // STATE: a map keeping track of all of the pane sizes
  const [sizes, setSizes] = useState<number[]>(initialSizes);
  const [movedSizes, setMovedSizes] = useState<number[]>(sizes);
  const [collapsedSizes, setCollapsedSizes] = useState<Nullable<number>[]>(
    originalCollapsedSizes ?? [children.length].fill(0)
  );
  // CALLBACKS  callback functions used throughout. all functions are memoized by useCallback
  const getMovedSizes = useGetMovedSizes({
    minSizes,
    sizes,
    isLtr,
    collapsedSize,
    collapsedIndices,
    isReversed,
  });
  const getCurrentPaneSizes = useGetCurrentPaneSizes({ childPanes, split });
  const handleDragFinished = useHandleDragFinished({ movedSizes, children, hooks, setSizes });
  const recalculateSizes = useRecalculateSizes({
    setMovedSizes,
    minSizes,
    collapsedIndices,
    collapsedSize,
    getCurrentPaneSizes,
    setSizes,
    originalMinSizes,
  });

  // STATE: if dragging, contains which pane is dragging and what the offset is.  If not dragging then null
  const { dragState, beginDrag } = useDragState(isVertical, handleDragFinished);

  const collapseSize = useCollapseSize({
    setMovedSizes,
    setSizes,
    minSizes,
    movedSizes,
    isReversed,
    collapsedIndices,
    collapsedSize,
  });
  const unCollapseSize = useUnCollapseSize({
    isReversed,
    movedSizes,
    minSizes,
    setMovedSizes,
    setSizes,
    collapsedSize,
    collapsedIndices,
  });
  const updateCollapsedSizes = useUpdateCollapsedSizes({
    sizes,
    collapsedSizes,
    setCollapsedSizes,
    movedSizes,
    collapseSize,
    unCollapseSize,
    hooks,
  });

  // EFFECTS: manage updates and calculations based on dependency changes for states that are interacted with by multiple functions
  useEffect(() => {
    if (dragState) setMovedSizes(getMovedSizes(dragState));
  }, [dragState, getMovedSizes]);

  useEffect(() => {
    if (dragState) hooks?.onChange?.(movedSizes);
  }, [dragState, movedSizes, hooks]);

  useEffect(() => {
    hooks?.onCollapse?.(collapsedSizes);
  }, [collapsedSizes, hooks]);

  useEffect(() => {
    updateCollapsedSizes(collapsedIndices);
  }, [collapsedIndices, updateCollapsedSizes]);
  // recalculate initial sizes on window size change to maintain min sizes

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetSizes = useCallback(
    debounce(() => recalculateSizes(), 100),
    [recalculateSizes]
  );

  useEventListener('resize', resetSizes);

  useEffect(() => recalculateSizes(initialSizes), [initialSizes, recalculateSizes]);

  //populates the sizes of all the initially populated childPanes, adjust sizes based on collapsed state
  const childPanesWithSizes: ChildPane[] = useMemo(
    () =>
      childPanes.map((child, index) => {
        return { ...child, size: movedSizes[index] };
      }),
    [childPanes, movedSizes]
  );

  const handleDragStart = useHandleDragStart({ isReversed, hooks, beginDrag });

  return {
    childPanes: childPanesWithSizes,
    // eslint-disable-next-line unicorn/no-null
    resizingIndex: dragState?.index || null,
    handleDragStart,
  };
};
