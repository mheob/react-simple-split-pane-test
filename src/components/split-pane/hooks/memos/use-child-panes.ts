import { MutableRefObject, ReactChild, RefObject, createRef, useMemo } from 'react';

import { ChildPane } from '../use-split-pane-resize';

// converts all children nodes into 'childPane' objects that has its ref, key, but not the size yet
export const useChildPanes = ({
  paneRefs,
  children,
  minSizes,
}: {
  paneRefs: MutableRefObject<Map<string, RefObject<HTMLDivElement>>>;
  children: ReactChild[];
  minSizes: number[];
}): Omit<ChildPane, 'size'>[] => {
  const childPanes: Omit<ChildPane, 'size'>[] = useMemo(() => {
    const previousPaneReferences = paneRefs.current;
    paneRefs.current = new Map<string, RefObject<HTMLDivElement>>();
    return children.map((node, index) => {
      const key = `index.${index}`;
      const reference = previousPaneReferences.get(key) || createRef();
      paneRefs.current.set(key, reference);
      return { key, node, ref: reference, minSize: minSizes[index] };
    });
  }, [children, minSizes, paneRefs]);
  return childPanes;
};
