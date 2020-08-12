import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import _debounce from 'lodash/debounce';
import { Box } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import styled from 'styled-components';

const MotionButton = styled(motion.div)`
  background-color: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FavoriteIcon = styled(Favorite)`
  color: rgb(244, 67, 54);
  font-size: 40px;
`;

const FavoriteBorderIcon = styled(FavoriteBorder)`
  color: rgb(244, 67, 54);
  font-size: 40px;
`;

const Count = styled.span`
  font-size: 12px;
  font-weight: bold;
`;

interface Props {
  count?: number;
  isActive?: boolean;
  onClick: () => void;
}

const FavoriteButtonComponent: React.FC<Props> = ({
  count = 0,
  isActive = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [burstEffect, setBurstEffect] = useState<any>(undefined);
  const [currentIsActive, setIsCurrentActive] = useState(isActive);
  const debouncedCallback = _debounce(onClick, 300);

  useEffect(() => {
    (async () => {
      if (ref.current) {
        const mojsLib = (await import('@mojs/core')).default;
        const burst = new mojsLib.Burst({
          parent: ref.current,
          count: 8,
          radius: { 20: 50 },
          children: {
            fill: { 'rgb(244, 67, 54)': 'rgb(244, 67, 54)' },
          },
        });
        setBurstEffect(burst);
      }
    })();
  }, []);

  const handleClick = async (e) => {
    setIsCurrentActive(true);
    // setCount(count + 1);
    burstEffect.replay();
    debouncedCallback();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        {currentIsActive ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </MotionButton>
      <Count>+{count}</Count>
    </Box>
  );
};

export default FavoriteButtonComponent;
