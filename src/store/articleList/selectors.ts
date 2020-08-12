import { createSelector } from 'reselect';
import NxvTextEncyptor from '@utils/encrypt-text';
import { RootState } from '../rootReducer';

export const articleListSelector = (state: RootState) => state.articleList;

export const selectIsArticleListLoading = createSelector(
  [articleListSelector],
  (articleListState) => articleListState.isLoading,
);

export const selectIsArticleListLoaded = createSelector(
  [articleListSelector],
  (articleListState) => articleListState.isLoaded,
);

export const selectFirestoreArticleList = createSelector(
  [articleListSelector],
  (articleListState) => {
    const { articleList } = articleListState;
    const decryptedUIDArticleList = articleList.map((article) => {
      return {
        ...article,
        uid: NxvTextEncyptor.decrypt(article.uid),
      };
    });
    return decryptedUIDArticleList;
  },
);

export const selectFirestoreArticleListLastDocument = createSelector(
  [articleListSelector],
  (articleListState) => articleListState.lastDocument,
);

export const selectAuthorArticleList = createSelector(
  [articleListSelector],
  (articleListState) => {
    const { authorArticleList } = articleListState;
    const decryptedUIDAuthorArticleList = authorArticleList.map((article) => {
      return {
        ...article,
        uid: NxvTextEncyptor.decrypt(article.uid),
      };
    });
    return decryptedUIDAuthorArticleList;
  },
);
