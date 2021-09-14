import { Fade, Grow, Zoom } from '@material-ui/core';
import { useMemo } from 'react';

import { CollapseOptions, TransitionType } from '../../split-pane';

type TransitionComponent = typeof Fade | typeof Grow | typeof Zoom;

const transitionComponentMap: {
  [key in TransitionType]: TransitionComponent;
} = {
  fade: Fade,
  grow: Grow,
  zoom: Zoom,
  none: Fade,
};

export const useTransition = (collapseOptions?: CollapseOptions): CollapseOptions =>
  useMemo(
    () => transitionComponentMap[collapseOptions?.buttonTransition ?? 'fade'],
    [collapseOptions]
  );
