import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import styled, { css } from 'styled-components';
import { Translate } from 'react-localize-redux';

import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  ButtonBase,
} from '@material-ui/core';

import { firebaseEmailLoginLinkSendThunk } from '@store/auth';
import { selectIsLoginModalOpen, hideLoginModal } from '@store/modal';

import firebase from '@services/initFirebase';

const StyledModal = styled(Modal).attrs({
  closeAfterTransition: true,
})`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Paper = styled.div`
  display: flex;
  height: 300px;
  max-width: 90%;
  width: 400px;
  padding: 20px;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
  ${({ theme }) => css`
    background-color: ${theme.palette.background.paper};
    boxshadow: ${theme.shadows[5]};
    @media (max-width: ${theme.breakPoint.sm}) {
      /* height: 30px; */
      width: 90%;
      max-width: 90%;
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

const StyledForm = styled.form`
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

const SocialButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  ${({ theme }) => css`
    @media (max-width: ${theme.breakPoint.sm}) {
      flex-direction: column;
    }
  `}
`;

const LoginModalComponent: React.FC = () => {
  const isOpen = useSelector(selectIsLoginModalOpen);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      useremail: '',
    },
    onSubmit: ({ useremail }) => {
      dispatch(firebaseEmailLoginLinkSendThunk(useremail));
    },
  });

  const onClickGoogleLoginButton = async () => {
    await firebase
      .auth()
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  };

  const handleClose = () => {
    dispatch(hideLoginModal());
  };

  const onClickKakaoLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${process.env.NXV_ENV.BASE_DOMAIN}/oauth/kakao`,
    });
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
              <StyledForm onSubmit={formik.handleSubmit}>
                <h2>
                  <Translate id="common.nexivil" />
                  &nbsp;
                  <Translate id="common.archive-labs" />
                </h2>
                <StyledTextField
                  id="useremail"
                  name="useremail"
                  type="email"
                  label="Email"
                  onChange={formik.handleChange}
                  value={formik.values.useremail}
                />
                <SubmitButton>
                  <Translate id="common.login" />
                  <span>&nbsp;/&nbsp;</span>
                  <Translate id="common.signup" />
                </SubmitButton>
              </StyledForm>
              <SocialButtonWrap>
                <ButtonBase onClick={onClickGoogleLoginButton}>
                  <img
                    src="/images/btn_google_signin@2x.png"
                    alt="google-login-button"
                    height="46"
                  />
                </ButtonBase>
                {/* <ButtonBase onClick={onClickKakaoLogin}>
                  <img
                    src="/images/kakao_login_btn_medium_narrow.png"
                    alt="google-login-button"
                    height="42"
                  />
                </ButtonBase> */}
              </SocialButtonWrap>
            </FormWrap>
          </Paper>
        </Fade>
      </StyledModal>
    </div>
  );
};

export default LoginModalComponent;
