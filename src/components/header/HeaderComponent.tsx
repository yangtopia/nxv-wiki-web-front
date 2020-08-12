import React from 'react';
import styled from 'styled-components';
import { Slide } from '@material-ui/core';

import {
  MainLayoutResponsiveWidth,
  FlexSpaceBetween,
} from '@styles/styled-mixins';
import useScrollDirection from '@hooks/useScrollDirection';

const FloatingWrap = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 8px;
`;

const Header = styled.header`
  ${FlexSpaceBetween}
  height: 64px;
  font-size: 25px;
  font-weight: bold;
  padding: 15px;
  margin: 0 auto;
  ${MainLayoutResponsiveWidth}
`;

interface Props {
  isFloating?: boolean;
}

const HeaderComponent: React.FC<Props> = ({ children }) => {
  const scrollDirection = useScrollDirection({ thresholdPixels: 50 });
  const isShowFloatingHeader = scrollDirection === 'up';

  return (
    <>
      <Slide in={isShowFloatingHeader}>
        <FloatingWrap>
          <Header>{children}</Header>
        </FloatingWrap>
      </Slide>
      <Header>{children}</Header>
    </>
  );
};

export default HeaderComponent;
