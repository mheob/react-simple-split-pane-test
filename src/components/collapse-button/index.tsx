import styled from '@emotion/styled';
import React from 'react';

const Button = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 300px;
  background: #0092d1;
  cursor: pointer;
  user-select: none;
  text-align: center;
  color: white;
  border: 2px rgba(200, 200, 200, 0.5) solid;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 100%;
    height: 100%;
  }
`;

type Direction = 'left' | 'right' | 'up' | 'down';

const paths: { [key in Direction]: string } = {
  ['left']: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  ['right']: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  ['up']: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  ['down']: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  dir: Direction;
}

const Icon: React.FC<IconProps> = (props) => (
  <svg {...props} focusable="false" fill="white" viewBox="0 0 24 24" aria-hidden="true">
    <path d={paths[props.dir]} />
  </svg>
);

interface CollapseButtonProps {
  isLtr: boolean;
  isVertical: boolean;
  isBefore: boolean;
  isReversed: boolean;
}
export const CollapseButton: React.FC<CollapseButtonProps> = (props) => {
  const directions: Direction[] = props.isVertical ? ['left', 'right'] : ['up', 'down'];
  const [a, b] = props.isReversed ? directions.reverse() : directions;
  const direction: Direction = props.isBefore ? (props.isLtr ? a : b) : props.isLtr ? b : a;
  return (
    <Button>
      <Icon dir={direction} />
    </Button>
  );
};
