import React from 'react';
import { NextPage } from 'next';
import _isEmpty from 'lodash/isEmpty';

import { LayoutContainer, ArticleEditorContainer } from '@containers/index';
import { fetchFirestoreArticleThunk } from '@store/article';

const EditPage: NextPage<{ isEditable: boolean; isServer: boolean }> = ({
  isEditable,
  isServer,
}) => {
  return (
    <LayoutContainer isShowAsideContainer={false}>
      <ArticleEditorContainer isEditable={isEditable} isServer={isServer} />
    </LayoutContainer>
  );
};

EditPage.getInitialProps = async ({ query, store, isServer }) => {
  const isEditable = !_isEmpty(query);
  if (isEditable && !isServer) {
    const { owner, slug } = query;
    await store.dispatch<any>(
      fetchFirestoreArticleThunk({
        username: owner as string,
        slug: slug as string,
        isEditing: true,
      }),
    );
  }

  return {
    isEditable,
    isServer,
  };
};

export default EditPage;
