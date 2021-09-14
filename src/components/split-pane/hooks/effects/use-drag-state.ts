import { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { useEventListener } from '../../../../hooks/use-event-listener';

export type ClientPosition = {
  clientX: number;
  clientY: number;
};

export type DragState = {
  offset: number;
  index: number;
};

export type BeginDragCallback = (props: { position: ClientPosition; index: number }) => void;

type DragStateHandlers = {
  beginDrag: BeginDragCallback;
  dragState?: DragState;
  onMouseMove?: (event: ClientPosition) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onMouseUp?: () => void;
  onMouseEnter?: (event: MouseEvent) => void;
};

const useDragStateHandlers = (
  isVertical: boolean,
  onDragFinished: (dragState: DragState) => void
): DragStateHandlers => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<number>();
  const [currentPos, setCurrentPos] = useState<number>();
  const [draggingIndex, setDraggingIndex] = useState<number>();

  const beginDrag: BeginDragCallback = useCallback(
    ({ position, index }: { position: ClientPosition; index: number }): void => {
      const pos = isVertical ? position.clientX : position.clientY;
      ReactDOM.unstable_batchedUpdates(() => {
        setDraggingIndex(index);
        setIsDragging(true);
        setDragStartPos(pos);
        setCurrentPos(pos);
      });
    },
    [isVertical]
  );

  const dragState: DragState | undefined = useMemo(() => {
    if (isDragging && currentPos && dragStartPos && draggingIndex) {
      const offset = currentPos - dragStartPos;
      return { offset, index: draggingIndex };
    } else return;
  }, [currentPos, dragStartPos, draggingIndex, isDragging]);

  const onMouseUp = useCallback((): void => {
    if (isDragging && dragState) {
      ReactDOM.unstable_batchedUpdates(() => {
        setIsDragging(false);
        onDragFinished(dragState);
      });
    }
  }, [isDragging, dragState, onDragFinished]);

  const onMouseMove = useCallback(
    (event: ClientPosition): void => {
      if (isDragging) {
        const pos = isVertical ? event.clientX : event.clientY;
        setCurrentPos(pos);
        // eslint-disable-next-line unicorn/no-useless-undefined
      } else setCurrentPos(undefined);
    },
    [isDragging, isVertical]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent): void => {
      if (isDragging) {
        onMouseMove(event.touches[0]);
      }
    },
    [isDragging, onMouseMove]
  );
  const onMouseEnter = useCallback(
    (event: MouseEvent): void => {
      if (isDragging) {
        const isPrimaryPressed = (event.buttons & 1) === 1;
        if (!isPrimaryPressed) {
          onMouseUp();
        }
      }
    },
    [isDragging, onMouseUp]
  );

  return { beginDrag, dragState, onMouseMove, onTouchMove, onMouseUp, onMouseEnter };
};

type UseDragStateReturn = {
  dragState?: DragState;
  beginDrag: BeginDragCallback;
};
export const useDragState = (
  isVertical: boolean,
  onDragFinished: (dragState: DragState) => void
): UseDragStateReturn => {
  const { beginDrag, dragState, onMouseMove, onTouchMove, onMouseUp, onMouseEnter } =
    useDragStateHandlers(isVertical, onDragFinished);

  useEventListener('mousemove', onMouseMove);
  useEventListener('touchmove', onTouchMove);
  useEventListener('mouseup', onMouseUp);
  useEventListener('mouseenter', onMouseEnter);

  return { dragState, beginDrag };
};
