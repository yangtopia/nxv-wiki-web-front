import { createReducer } from 'typesafe-actions';
import { FirestoreArticle } from '@models/firebase';
import {
  ArticleActionTypes,
  fetchFirestoreArticleAction,
  deleteFirestoreArticleAction,
  createFirestoreArticleAction,
  updateFirestoreArticleAction,
  updateArticleClapCountAction,
  fetchArticleTagsAction,
} from './actions';

export interface ArticleState {
  isLoading: boolean;
  firestoreArticle?: FirestoreArticle;
  tags: string[];
  isTagLoading: boolean;
  error: any;
}

const INITIAL_STATE: ArticleState = {
  isLoading: false,
  tags: [],
  isTagLoading: false,
  error: null,
};

const reducer = createReducer<ArticleState, ArticleActionTypes>(INITIAL_STATE)
  .handleAction(fetchArticleTagsAction.request, (state) => {
    return {
      ...state,
      isTagLoading: true,
    };
  })
  .handleAction(fetchArticleTagsAction.success, (state, { payload }) => {
    return {
      ...state,
      isTagLoading: false,
      tags: payload,
    };
  })
  .handleAction(fetchFirestoreArticleAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(fetchFirestoreArticleAction.success, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      firestoreArticle: payload,
    };
  })
  .handleAction(fetchFirestoreArticleAction.failure, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      error: payload,
    };
  })
  .handleAction(deleteFirestoreArticleAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(deleteFirestoreArticleAction.success, (state) => {
    return {
      ...state,
      isLoading: false,
      firestoreArticle: undefined,
    };
  })
  .handleAction(deleteFirestoreArticleAction.failure, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      error: payload,
    };
  })
  .handleAction(createFirestoreArticleAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(createFirestoreArticleAction.success, (state) => {
    return {
      ...state,
      isLoading: false,
    };
  })
  .handleAction(createFirestoreArticleAction.failure, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      error: payload,
    };
  })
  .handleAction(updateFirestoreArticleAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(updateFirestoreArticleAction.success, (state) => {
    return {
      ...state,
      isLoading: false,
    };
  })
  .handleAction(updateFirestoreArticleAction.failure, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      error: payload,
    };
  })
  .handleAction(updateArticleClapCountAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(updateArticleClapCountAction.success, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      firestoreArticle: payload,
    };
  })
  .handleAction(updateArticleClapCountAction.failure, (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      error: payload,
    };
  });

export default reducer;
