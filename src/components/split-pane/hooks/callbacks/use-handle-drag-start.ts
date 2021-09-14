import { useCallback } from 'react';

import type { SplitPaneHooks } from '../..';
import type { BeginDragCallback, ClientPosition } from '../effects/use-drag-state';

type DragOptions = { index: number; position: ClientPosition };

/**
 * Callback that starts the drag process and called at the beginning of the dragging.
 */
export const useHandleDragStart = ({
  isReversed,
  hooks,
  beginDrag,
}: {
  isReversed: boolean;
  hooks?: SplitPaneHooks;
  beginDrag: BeginDragCallback;
}): (({ index, position }: DragOptions) => void) =>
  useCallback(
    ({ index, position }: DragOptions): void => {
      hooks?.onDragStarted?.();
      beginDrag({ position, index: isReversed ? index - 1 : index });
    },
    [beginDrag, hooks, isReversed]
  );
