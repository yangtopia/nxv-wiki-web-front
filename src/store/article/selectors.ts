import { createSelector } from 'reselect';
import NxvTextEncyptor from '@utils/encrypt-text';
import { RootState } from '../rootReducer';

export const articleSelector = (state: RootState) => state.article;

export const selectIsArticleLoading = createSelector(
  [articleSelector],
  (articleState) => articleState.isLoading,
);

export const selectFirestoreArticle = createSelector(
  [articleSelector],
  (articleState) => {
    const { firestoreArticle } = articleState;
    if (firestoreArticle) {
      return {
        ...firestoreArticle,
        uid: NxvTextEncyptor.decrypt(firestoreArticle.uid),
      };
    }
    return undefined;
  },
);

export const selectIsTagLoading = createSelector(
  [articleSelector],
  (articleState) => articleState.isTagLoading,
);

export const selectSearchedArticleTags = createSelector(
  [articleSelector],
  (articleState) => articleState.tags,
);
