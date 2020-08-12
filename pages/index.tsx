import React from 'react';
import { NextPage } from 'next';

import { LayoutContainer, ArticleGridContainer } from '@containers/index';
import { fetchFirestoreArticleListThunk } from '@store/articleList';

export interface MainPageProps {
  searchTag?: string;
}

const MainPage: NextPage<MainPageProps> = (query) => {
  return (
    <LayoutContainer>
      <ArticleGridContainer {...query} />
    </LayoutContainer>
  );
};

MainPage.getInitialProps = async ({ store, isServer, query }) => {
  return query;
};

export default MainPage;
