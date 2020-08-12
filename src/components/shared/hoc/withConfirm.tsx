import React, { PureComponent, ComponentType, ComponentClass } from 'react';
import styled, { css } from 'styled-components';
import { Modal, Backdrop, Fade, Button } from '@material-ui/core';

const StyledModal = styled(Modal).attrs({
  closeAfterTransition: true,
})`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 90%;
  padding: 20px;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
  ${({ theme }) => css`
    background-color: ${theme.palette.background.paper};
    boxshadow: ${theme.shadows[5]};
    @media (max-width: ${theme.breakPoint.sm}) {
      width: 90%;
      padding: 20px;
    }
  `}
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ConfirmButton = styled(Button).attrs({
  type: 'submit',
  color: 'secondary',
  variant: 'outlined',
})`
  margin-left: 10px;
`;

const CancelButton = styled(Button).attrs({
  type: 'submit',
  color: 'primary',
  variant: 'contained',
})`
  margin-left: 10px;
`;

interface WithConfirmState {
  isOpen: boolean;
}

export interface WithConfirmProps {
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmMessage?: string;
  onOpen?: () => void;
  onClickConfirm?: () => void;
  onClickCancel?: () => void;
}

const withConfirm = <P extends WithConfirmProps>(
  WrappedComponent: ComponentType<P>,
): ComponentClass<P> => {
  return class WithConfirm extends PureComponent<P, WithConfirmState> {
    constructor(props: P) {
      super(props);
      this.state = {
        isOpen: false,
      };
    }

    handleOpen = () => {
      this.setState({
        isOpen: true,
      });
    };

    handleClose = () => {
      this.setState({
        isOpen: false,
      });
    };

    handleConfirm = () => {
      const { onClickConfirm } = this.props;
      if (onClickConfirm) {
        onClickConfirm();
      }
      this.handleClose();
    };

    handleCancel = () => {
      const { onClickCancel } = this.props;
      if (onClickCancel) {
        onClickCancel();
      }
      this.handleClose();
    };

    render() {
      const {
        confirmMessage,
        confirmButtonText,
        cancelButtonText,
      } = this.props;
      const { isOpen } = this.state;

      return (
        <>
          <div>
            <StyledModal
              open={isOpen}
              onClose={this.handleClose}
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={isOpen}>
                <Paper>
                  <h3>{confirmMessage}</h3>
                  <ButtonWrap>
                    <ConfirmButton onClick={this.handleConfirm}>
                      {confirmButtonText || 'OK'}
                    </ConfirmButton>
                    <CancelButton onClick={this.handleCancel}>
                      {cancelButtonText || 'CANCEL'}
                    </CancelButton>
                  </ButtonWrap>
                </Paper>
              </Fade>
            </StyledModal>
          </div>
          <WrappedComponent {...this.props} onOpen={this.handleOpen} />
        </>
      );
    }
  };
};

export default withConfirm;
