import { Dispatch, ReactChild, SetStateAction, useCallback } from 'react';

import type { SplitPaneHooks } from '../../index';

/**
 * called at the end of a drag, sets the final size as well as runs the callback hook
 */
export const useHandleDragFinished = ({
  setSizes,
  hooks,
  movedSizes,
}: {
  children: ReactChild[];
  setSizes: Dispatch<SetStateAction<number[]>>;
  movedSizes: number[];
  hooks?: SplitPaneHooks;
}): (() => void) =>
  useCallback(() => {
    setSizes(movedSizes);
    hooks?.onSaveSizes?.(movedSizes);
  }, [movedSizes, hooks, setSizes]);
