import React from 'react';
import { NextPage } from 'next';

import { LayoutContainer } from '@containers/index';
import dynamic from 'next/dynamic';

const ArticleEditorContainer = dynamic(
  () => import('@containers/ArticleEditorContainer'),
  {
    ssr: false,
  },
);

const WritePage: NextPage = () => {
  return (
    <LayoutContainer isShowAsideContainer={false}>
      <ArticleEditorContainer />
    </LayoutContainer>
  );
};

WritePage.getInitialProps = async ({ isServer }) => {
  // console.log(isServer);
};

export default WritePage;
