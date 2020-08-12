import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';

import {
  MessageSnackbarComponent,
  LoginModalComponent,
  UsernameModalComponent,
  BrowserWarningModalComponent,
} from '@components/shared';

import { selectFirestoreArticle } from '@store/article';
import { MainLayoutResponsiveWidth } from '@styles/styled-mixins';

import AsideContainer from './AsideContainer';
import HeaderContainer from './HeaderContainer';

const MainPageWrap = styled.main`
  margin: 0 auto;
  display: flex;
  position: relative;
  justify-content: space-between;
  ${MainLayoutResponsiveWidth}
`;

interface Props {
  isShowAsideContainer?: boolean;
  isShowAuthorProfile?: boolean;
}

const LayoutContainer: React.FC<Props> = ({
  children,
  isShowAsideContainer = true,
}) => {
  const [canonicalHref, setCanonicalHref] = useState<string>();
  const { pathname } = useRouter();
  const article = useSelector(selectFirestoreArticle);
  const isShowAuthorProfile =
    !isEmpty(article) && pathname === '/[owner]/[slug]';

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setCanonicalHref(window.location.href);
  }, []);

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalHref} />
      </Head>
      <LoginModalComponent />
      <UsernameModalComponent />
      <BrowserWarningModalComponent />
      <MessageSnackbarComponent />
      <HeaderContainer />
      <MainPageWrap>
        {children}
        {isShowAsideContainer && (
          <AsideContainer isShowAuthorProfile={isShowAuthorProfile} />
        )}
      </MainPageWrap>
    </>
  );
};

export default LayoutContainer;
