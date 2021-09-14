import { useMemo } from 'react';

import { Nullable, SplitPaneProps } from '../../index';

export const useCollapsedSizes = ({
  collapsedSizes,
  children,
  collapse,
}: Pick<SplitPaneProps, 'collapsedSizes' | 'children' | 'collapse'>): Nullable<number>[] =>
  useMemo(
    () =>
      collapsedSizes?.length === children.length && !!collapse
        ? collapsedSizes
        : [children.length].fill(0),
    [children.length, collapse, collapsedSizes]
  );
