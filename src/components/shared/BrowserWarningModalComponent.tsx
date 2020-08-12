import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import styled, { css } from 'styled-components';

import { Backdrop, Fade, Modal } from '@material-ui/core';
import {
  selectIsBrowserWarnModalOpen,
  hideBrowserWarnModal,
} from '@store/modal';

const StyledModal = styled(Modal).attrs({
  closeAfterTransition: true,
})`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  display: flex;
  max-width: 90%;
  padding: 0 20px;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
  ${({ theme }) => css`
    background-color: ${theme.palette.background.paper};
    boxshadow: ${theme.shadows[5]};
    @media (max-width: ${theme.breakPoint.sm}) {
      width: 90%;
      flex-direction: column;
    }
  `}
`;

const WarningText = styled.h4``;

const BrowserWarningModalComponent: React.FC = () => {
  const isOpen = useSelector(selectIsBrowserWarnModalOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideBrowserWarnModal());
  };

  return (
    <div>
      <StyledModal
        open={isOpen}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Paper>
            <WarningText>
              <Translate id="message.warning.ie" />
            </WarningText>
          </Paper>
        </Fade>
      </StyledModal>
    </div>
  );
};

export default BrowserWarningModalComponent;
