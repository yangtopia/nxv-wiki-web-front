import { createAsyncAction, ActionType } from 'typesafe-actions';
import { FirestoreArticle } from '@models/firebase';

export const fetchFirestoreArticleAction = createAsyncAction(
  'article/GET_FIRESTORE_ARTICEL_REQUEST',
  'article/GET_FIRESTORE_ARTICEL_SUCCESS',
  'article/GET_FIRESTORE_ARTICEL_FAILURE',
)<void, FirestoreArticle, any>();

export const deleteFirestoreArticleAction = createAsyncAction(
  'article/DELETE_FIRESTORE_ARTICEL_REQUEST',
  'article/DELETE_FIRESTORE_ARTICEL_SUCCESS',
  'article/DELETE_FIRESTORE_ARTICEL_FAILURE',
)<void, void, any>();

export const createFirestoreArticleAction = createAsyncAction(
  'article/CREATE_FIRESTORE_ARTICEL_REQUEST',
  'article/CREATE_FIRESTORE_ARTICEL_SUCCESS',
  'article/CREATE_FIRESTORE_ARTICEL_FAILURE',
)<void, void, any>();

export const updateFirestoreArticleAction = createAsyncAction(
  'article/UPDATE_FIRESTORE_ARTICEL_REQUEST',
  'article/UPDATE_FIRESTORE_ARTICEL_SUCCESS',
  'article/UPDATE_FIRESTORE_ARTICEL_FAILURE',
)<void, void, any>();

export const updateArticleClapCountAction = createAsyncAction(
  'article/UPDATE_ARTICLE_CLAP_COUNT_REQUEST',
  'article/UPDATE_ARTICLE_CLAP_COUNT_SUCCESS',
  'article/UPDATE_ARTICLE_CLAP_COUNT_FAILURE',
)<void, FirestoreArticle, any>();

export const fetchArticleTagsAction = createAsyncAction(
  'article/GET_FIRESTORE_ARTICLE_TAG_REQUEST',
  'article/GET_FIRESTORE_ARTICLE_TAG_SUCCESS',
  'article/GET_FIRESTORE_ARTICLE_TAG_FAILURE',
)<void, any, any>();

export const updateArticleTagsAction = createAsyncAction(
  'article/UPDATE_FIRESTORE_ARTICLE_TAG_REQUEST',
  'article/UPDATE_FIRESTORE_ARTICLE_TAG_SUCCESS',
  'article/UPDATE_FIRESTORE_ARTICLE_TAG_FAILURE',
)<void, void, any>();

export const updateArticleActiveAction = createAsyncAction(
  'article/UPDATE_ARTICLE_ACTIVE_REQUEST',
  'article/UPDATE_ARTICLE_ACTIVE_SUCCESS',
  'article/UPDATE_ARTICLE_ACTIVE_FAILURE',
)<void, void, any>();

export const updateArticleViewCountAction = createAsyncAction(
  'article/UPDATE_ARTICLE_VIEW_COUNT_REQUEST',
  'article/UPDATE_ARTICLE_VIEW_COUNT_SUCCESS',
  'article/UPDATE_ARTICLE_VIEW_COUNT_FAILURE',
)<void, void, any>();

export type ArticleActionTypes =
  | ActionType<typeof fetchFirestoreArticleAction>
  | ActionType<typeof deleteFirestoreArticleAction>
  | ActionType<typeof createFirestoreArticleAction>
  | ActionType<typeof updateFirestoreArticleAction>
  | ActionType<typeof updateArticleClapCountAction>
  | ActionType<typeof fetchArticleTagsAction>
  | ActionType<typeof updateArticleTagsAction>
  | ActionType<typeof updateArticleActiveAction>
  | ActionType<typeof updateArticleViewCountAction>;
