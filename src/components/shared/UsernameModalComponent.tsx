import React from 'react';
import { useFormik } from 'formik';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { Backdrop, Button, Fade, Modal, TextField } from '@material-ui/core';
import { setFirestoreUsernameThunk } from '@store/auth';
import { selectIsUsernameModalOpen, hideUsernameModal } from '@store/modal';
import nicknamePurifier from '@utils/nicknamePurifier';

const StyledModal = styled(Modal).attrs({
  closeAfterTransition: true,
})`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  display: flex;
  /* height: 30px; */
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
      height: 350px;
      width: 90%;
      flex-direction: column;
      padding: 20px;
    }
  `}
`;

const FormWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  ${({ theme }) => css`
    @media (max-width: ${theme.breakPoint.sm}) {
      height: 100%;
    }
  `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField).attrs({
  variant: 'outlined',
  size: 'medium',
})`
  & > * {
    font-size: 14px;
  }
  margin-bottom: 15px;
`;

const SubmitButton = styled(Button).attrs({
  type: 'submit',
  color: 'primary',
  variant: 'contained',
})``;

const Title = styled.h2`
  margin-bottom: 0;
`;

const Description = styled.p`
  font-size: 12px;
`;

const UsernameModalComponent: React.FC = () => {
  const isOpen = useSelector(selectIsUsernameModalOpen);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    onSubmit: ({ username: nickname }) => {
      const purifiedNickname = nicknamePurifier(nickname);
      dispatch(setFirestoreUsernameThunk(purifiedNickname));
    },
  });

  const handleClose = () => {
    dispatch(hideUsernameModal());
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
            <FormWrap>
              <Form onSubmit={formik.handleSubmit}>
                <Title>
                  <Translate id="message.auth.enter-nickname" />
                </Title>
                <Description>공백, 특수문자 제외</Description>
                <StyledTextField
                  id="username"
                  name="username"
                  type="text"
                  label="Nickname"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <SubmitButton>
                  <Translate id="common.confirm" />
                </SubmitButton>
              </Form>
            </FormWrap>
          </Paper>
        </Fade>
      </StyledModal>
    </div>
  );
};

export default UsernameModalComponent;
