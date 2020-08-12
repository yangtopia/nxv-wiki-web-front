import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { fromEvent } from 'rxjs';

interface ScrollBarProps {
  thickness: number;
  duration: number;
  bgColor: string;
  scrollWidth: string | null;
}

const ScrollBar = styled.div<ScrollBarProps>`
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  z-index: 99;
  background-color: ${(props) => props.bgColor};
  height: ${(props) => props.thickness}px;
  width: ${(props) => props.scrollWidth};
  transition-property: width;
  transition-duration: ${(props) => props.duration}s;
  transition-timing-function: ease-out;
`;

interface ComponentProps {
  thickness?: number;
  duration?: number;
  bgColor?: string;
}

const ScrollProgressBarComponent: React.FC<ComponentProps> = ({
  thickness = 3,
  duration = 0.3,
  bgColor = '#fdd108',
}) => {
  const [width, setWidth] = useState<string | null>(null);

  useEffect(() => {
    const scrollEventSubscription = fromEvent(window, 'scroll').subscribe(
      () => {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (height > 0) {
          setWidth(`${scrolled}%`);
        } else {
          setWidth(null);
        }
      },
    );
    return () => {
      scrollEventSubscription.unsubscribe();
    };
  }, []);
  return (
    <ScrollBar
      scrollWidth={width}
      bgColor={bgColor}
      thickness={thickness}
      duration={duration}
    />
  );
};

export default ScrollProgressBarComponent;
