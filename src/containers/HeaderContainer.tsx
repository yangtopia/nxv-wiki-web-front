import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ReactSVG } from 'react-svg';

import {
  HeaderComponent,
  LoginButtonComponent,
  MenuComponent,
} from '@components/header';

import { selectFirestoreUserInfo } from '@store/auth';
import { TagSearchInputComponent } from '@components/shared';
import { useMediaQuery } from '@material-ui/core';
import { fetchFirestoreArticleListThunk } from '@store/articleList';

const LogoWrap = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  color: inherit;
  text-decoration: none;
  cursor: pointer;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (min-width: ${(props) => props.theme.breakPoint.md}) {
    min-width: 280px;
  }
`;

const HeaderContainer: React.FC = () => {
  const userProfile = useSelector(selectFirestoreUserInfo);
  const isShowTagInput = useMediaQuery('(min-width: 960px)');
  const dispatch = useDispatch();
  const router = useRouter();

  const onClickLogo = () => {
    dispatch(
      fetchFirestoreArticleListThunk({
        isReset: true,
      }),
    );
    window.location.href = '/';
  };

  return (
    <HeaderComponent>
      <LogoWrap>
        <Logo onClick={onClickLogo}>
          <ReactSVG src="/svgs/Logo-Horizontal-Light.svg" />
        </Logo>
        {isShowTagInput && <TagSearchInputComponent />}
      </LogoWrap>
      <ButtonWrap>
        {userProfile ? <MenuComponent /> : <LoginButtonComponent />}
      </ButtonWrap>
    </HeaderComponent>
  );
};

export default HeaderContainer;
