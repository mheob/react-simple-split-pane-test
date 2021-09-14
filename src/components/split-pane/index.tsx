import { CSSProperties, FC, Fragment, ReactChild, ReactElement, useState } from 'react';

import { useMergeClasses } from '../../hooks';
import { Pane } from '../Pane';
import { Resizer } from '../Resizer';
import { useGetIsPaneCollapsed } from './hooks/callbacks/use-get-is-collapsed';
import { useToggleCollapse } from './hooks/callbacks/use-toggle-collapse';
import { useCollapseOptions } from './hooks/memos/use-collapse-options';
import { useCollapsedSizes } from './hooks/memos/use-collapsed-sizes';
import { useIsCollapseReversed } from './hooks/memos/use-is-collapse-reversed';
import { useIsLtr } from './hooks/memos/use-is-ltr';
import { useSplitPaneResize } from './hooks/use-split-pane-resize';
import { Wrapper, convertCollapseSizesToIndices, getMinSize } from './utils';

export type Nullable<T> = T | null;

export type SplitType = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';
export type TransitionType = 'fade' | 'grow' | 'zoom' | 'none';
export type CollapseDirection = 'left' | 'right' | 'up' | 'down';

export type SplitPaneHooks = {
  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onSaveSizes?: (sizes: number[]) => void;
  onCollapse?: (collapsedSizes: Nullable<number>[]) => void;
};
export type CollapseOptions = {
  beforeToggleButton: ReactElement;
  afterToggleButton: ReactElement;
  buttonTransition: TransitionType;
  buttonTransitionTimeout: number;
  buttonPositionOffset: number;
  collapseDirection: CollapseDirection;
  collapseTransitionTimeout: number;
  collapsedSize: number;
  overlayCss: CSSProperties;
};
export type ResizerOptions = {
  css?: CSSProperties;
  hoverCss?: CSSProperties;
  grabberSize?: number | string;
};

export type SplitPaneProps = {
  split: SplitType;
  collapse?: boolean | Partial<CollapseOptions>;

  dir?: Direction;
  className?: string;

  initialSizes?: number[];
  minSizes?: number | number[];
  collapsedSizes?: Nullable<number>[];

  hooks?: SplitPaneHooks;
  resizerOptions?: ResizerOptions;

  children: ReactChild[];
};

export const SplitPane: FC<SplitPaneProps> = (props) => {
  const collapsedSizes = useCollapsedSizes(props);
  const isLtr = useIsLtr(props);
  const isVertical = props.split === 'vertical';
  const isReversed = useIsCollapseReversed(props.collapse);

  const collapseOptions = useCollapseOptions({
    isVertical,
    isLtr,
    originalValue: props.collapse,
    isReversed,
  });

  const [collapsedIndices, setCollapsed] = useState<number[]>(
    convertCollapseSizesToIndices(collapsedSizes)
  );

  const { childPanes, handleDragStart, resizingIndex } = useSplitPaneResize({
    ...props,
    isLtr,
    isVertical,
    collapsedIndices,
    collapsedSizes,
    collapseOptions,
  });

  const splitPaneClass = useMergeClasses(['SplitPane', props.split, props.className]);
  const resizingClass = useMergeClasses(['Resizing', props.className]);

  const toggleCollapse = useToggleCollapse({ setCollapsed, collapsedIndices });
  const getIsPaneCollapsed = useGetIsPaneCollapsed({ collapsedIndices });

  if (childPanes.length <= 1) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[react-collapse-pane] - You must have more than one non-null child inside the SplitPane component.  Even though SplitPane does not crash, you should resolve this error.'
      );
    }
    return <>{props.children}</>;
  }

  // stacks the children and places a resizer in between each of them. Each resizer has the same index as the pane that it controls.
  const entries = childPanes.map((pane, paneIndex) => {
    const resizerPaneIndex = isReversed ? paneIndex : paneIndex - 1;
    return (
      <Fragment key={paneIndex}>
        {paneIndex - 1 >= 0 && (
          <Resizer
            key={`resizer.${resizerPaneIndex}`}
            isCollapsed={getIsPaneCollapsed(resizerPaneIndex)}
            isVertical={isVertical}
            isLtr={isLtr}
            split={props.split}
            className={resizingIndex === resizerPaneIndex ? resizingClass : props.className}
            paneIndex={resizerPaneIndex}
            resizerOptions={props.resizerOptions}
            collapseOptions={collapseOptions}
            onDragStarted={handleDragStart}
            onCollapseToggle={toggleCollapse}
          />
        )}
        <Pane
          key={`pane.${paneIndex}`}
          forwardRef={pane.ref}
          size={pane.size}
          isCollapsed={getIsPaneCollapsed(paneIndex)}
          collapsedIndices={collapsedIndices}
          split={props.split}
          isVertical={isVertical}
          minSize={getMinSize(paneIndex, props.minSizes)}
          className={props.className}
          transitionTimeout={collapseOptions?.collapseTransitionTimeout}
          collapseOverlayCss={collapseOptions?.overlayCss}
        >
          {pane.node}
        </Pane>
      </Fragment>
    );
  });

  return (
    <Wrapper key="split-pane-wrapper" className={splitPaneClass} split={props.split}>
      {entries}
    </Wrapper>
  );
};

SplitPane.displayName = 'SplitPane';
