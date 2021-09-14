import { useMemo } from 'react';

import { CollapseOptions } from '../../index';

export const DEFAULT_COLLAPSE_SIZE = 50;

export const useCollapsedSize = ({
  collapseOptions,
}: {
  collapseOptions?: CollapseOptions;
}): number =>
  useMemo(() => collapseOptions?.collapsedSize ?? DEFAULT_COLLAPSE_SIZE, [collapseOptions]);
