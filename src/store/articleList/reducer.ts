import { createReducer } from 'typesafe-actions';
import _last from 'lodash/last';
import _isEqual from 'lodash/isEqual';
import _unionWith from 'lodash/unionWith';
import { FirestoreArticle } from '@models/firebase';
import {
  ArticleListActionTypes,
  fetchFirestoreArticleListAsyncAction,
  fetchFirestoreAuthorArticleListAsyncAction,
} from './actions';

export interface ArticleListState {
  isLoading: boolean;
  isLoaded: boolean;
  articleList: FirestoreArticle[];
  lastDocument?: FirestoreArticle;
  authorArticleList: FirestoreArticle[];
  error: any;
}

const INITIAL_STATE: ArticleListState = {
  isLoading: false,
  isLoaded: false,
  articleList: [],
  authorArticleList: [],
  error: null,
};

const reducer = createReducer<ArticleListState, ArticleListActionTypes>(
  INITIAL_STATE,
)
  .handleAction(fetchFirestoreArticleListAsyncAction.request, (state) => {
    return {
      ...state,
      isLoading: true,
      isLoaded: false,
    };
  })
  .handleAction(
    fetchFirestoreArticleListAsyncAction.success,
    (state, { payload }) => {
      const { articleList } = state;
      const { articles, isReset, lastDocument } = payload;

      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        articleList: isReset ? articles : [...articleList, ...articles],
        lastDocument,
      };
    },
  )
  .handleAction(
    fetchFirestoreArticleListAsyncAction.failure,
    (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        error: payload,
      };
    },
  )
  .handleAction(
    fetchFirestoreAuthorArticleListAsyncAction.request,
    (state) => ({
      ...state,
      isLoading: true,
    }),
  )
  .handleAction(
    fetchFirestoreAuthorArticleListAsyncAction.success,
    (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        authorArticleList: payload,
      };
    },
  )
  .handleAction(
    fetchFirestoreAuthorArticleListAsyncAction.failure,
    (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    },
  );

export default reducer;
