import React from 'react';
import styled from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { selectMesssage, hideMessage } from '@store/message';
import { Translate } from 'react-localize-redux';

const Wrap = styled.div`
  width: 100%;
  & > * + * {
    margin-top: 2;
  }
`;

const StyledAlert = styled(MuiAlert).attrs({
  elevation: 6,
  variant: 'filled',
})`
  font-size: 14px;
`;

const MessageSnackbarComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, messageCode, message, severity } = useSelector(
    selectMesssage,
  );

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideMessage());
  };
  return (
    <Wrap>
      {isOpen && (
        <Snackbar
          open={isOpen}
          autoHideDuration={1500}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          <StyledAlert onClose={handleClose} severity={severity}>
            <Translate id={messageCode} data={{ message }} />
          </StyledAlert>
        </Snackbar>
      )}
    </Wrap>
  );
};

export default MessageSnackbarComponent;
