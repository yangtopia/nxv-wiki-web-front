import React from 'react';
import { NextPage } from 'next';

import { ArticleDetailContainer, LayoutContainer } from '@containers/index';
import { fetchFirestoreArticleThunk } from '@store/article';
import {
  ArticleOpenGraphComponent,
  ScrollProgressBarComponent,
} from '@components/shared';
import { FirestoreArticle } from '@models/firebase';

interface PageProps {
  article: FirestoreArticle;
}

const ArticleDetail: NextPage<PageProps> = ({ article }) => {
  return (
    <>
      <ScrollProgressBarComponent />
      <ArticleOpenGraphComponent article={article} />
      <LayoutContainer>
        <ArticleDetailContainer />
      </LayoutContainer>
    </>
  );
};

ArticleDetail.getInitialProps = async ({ query, store }) => {
  const { owner, slug } = query;
  await store.dispatch<any>(
    fetchFirestoreArticleThunk({
      username: owner as string,
      slug: slug as string,
    }),
  );
  const { firestoreArticle } = store.getState().article;
  return {
    article: firestoreArticle,
  };
};

export default ArticleDetail;
