import { CollapseButton } from '../../../collapse-button';
import { CollapseOptions } from '../../index';

const getDefault = (props: {
  isVertical: boolean;
  isLtr: boolean;
  isReversed: boolean;
}): CollapseOptions => ({
  beforeToggleButton: <CollapseButton {...props} isBefore={true} />,
  afterToggleButton: <CollapseButton {...props} isBefore={false} />,
  collapseDirection: props.isVertical ? 'left' : 'up',
  overlayCss: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  buttonTransitionTimeout: 200,
  buttonTransition: 'grow',
  collapsedSize: 50,
  collapseTransitionTimeout: 500,
  buttonPositionOffset: 0,
});

/**
 * function that returns a set of valid collapseOptions from uncertain input.
 */
export const useCollapseOptions = ({
  originalValue,
  ...orientationDetails
}: {
  originalValue: Partial<CollapseOptions> | undefined | boolean;
  isVertical: boolean;
  isLtr: boolean;
  isReversed: boolean;
}): Required<CollapseOptions> | undefined => {
  if (!originalValue) return;
  if (originalValue === true) return getDefault(orientationDetails);
  return { ...getDefault(orientationDetails), ...originalValue };
};
