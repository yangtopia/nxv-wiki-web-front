import React from 'react';
import { NextPage } from 'next';

import { LayoutContainer, MyInfoContainer } from '@containers/index';

const MyInfoPage: NextPage = () => {
  return (
    <LayoutContainer isShowAsideContainer={false}>
      <MyInfoContainer />
    </LayoutContainer>
  );
};

MyInfoPage.getInitialProps = async ({ isServer }) => {
  // console.log(isServer);
};

export default MyInfoPage;
