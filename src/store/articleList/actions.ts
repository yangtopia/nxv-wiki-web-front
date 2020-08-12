import { createAsyncAction, ActionType } from 'typesafe-actions';
import { FirestoreArticle } from '@models/firebase';

export interface FetchFirestoreArticleReqParams {
  articles: FirestoreArticle[];
  isReset: boolean;
  lastDocument?: FirestoreArticle;
}

export const fetchFirestoreArticleListAsyncAction = createAsyncAction(
  'articleList/FETCH_FIRESTORE_ARTICLE_REQUEST',
  'articleList/FETCH_FIRESTORE_ARTICLE_SUCCESS',
  'articleList/FETCH_FIRESTORE_ARTICLE_FAILURE',
)<void, FetchFirestoreArticleReqParams, any>();

export const fetchFirestoreAuthorArticleListAsyncAction = createAsyncAction(
  'articleList/FETCH_FIRESTORE_ARTICLE_LIST_BY_AUTHOR_REQUEST',
  'articleList/FETCH_FIRESTORE_ARTICLE_LIST_BY_AUTHOR_SUCCESS',
  'articleList/FETCH_FIRESTORE_ARTICLE_LIST_BY_AUTHOR_FAILURE',
)<void, FirestoreArticle[], any>();

export type ArticleListActionTypes =
  | ActionType<typeof fetchFirestoreArticleListAsyncAction>
  | ActionType<typeof fetchFirestoreAuthorArticleListAsyncAction>;
