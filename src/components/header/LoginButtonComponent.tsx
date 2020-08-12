import React from 'react';
import { useDispatch } from 'react-redux';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import { isIE } from 'react-device-detect';

import { Button } from '@material-ui/core';
import { showLoginModal, showBrowserWarnModal } from '@store/modal';

const StyledButton = styled(Button).attrs({
  variant: 'contained',
  color: 'primary',
  type: 'button',
})`
  margin: 0 12px;
`;

const LoginButtonComponent: React.FC = () => {
  const dispatch = useDispatch();

  const onClickHandler = () => {
    if (isIE) {
      dispatch(showBrowserWarnModal());
      return;
    }
    dispatch(showLoginModal());
  };

  return (
    <StyledButton onClick={onClickHandler}>
      <Translate id="common.login" />
    </StyledButton>
  );
};

export default LoginButtonComponent;
