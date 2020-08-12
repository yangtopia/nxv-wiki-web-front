import NxvTextEncyptor from '@utils/encrypt-text';

import _isEmpty from 'lodash/isEmpty';
import _flow from 'lodash/flow';
import _update from 'lodash/fp/update';

import { ARTICLE_COLLECTION_NAME } from '@services/initFirebase';

import { ExtendedThunkAction } from '@models/redux';
import { FirestoreArticle } from '@models/firebase';

import { showMessage } from '../message/actions';
import {
  ArticleListActionTypes,
  fetchFirestoreArticleListAsyncAction,
  fetchFirestoreAuthorArticleListAsyncAction,
} from './actions';

interface Params {
  isReset: boolean;
  searchTag?: string;
}

export function fetchFirestoreArticleListThunk(
  params: Params,
): ExtendedThunkAction<ArticleListActionTypes> {
  return async (dispatch, getState, firebase) => {
    const { isReset, searchTag } = params;
    const { lastDocument } = getState().articleList;
    const { request, success, failure } = fetchFirestoreArticleListAsyncAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const ARTICLE_LIMIT = 9;

      const articlesRef = (() => {
        const ref = firestore
          .collection(ARTICLE_COLLECTION_NAME)
          .where('isActive', '==', true)
          .orderBy('created', 'desc')
          .limit(ARTICLE_LIMIT);
        return _isEmpty(searchTag)
          ? ref
          : ref.where('tags', 'array-contains', searchTag);
      })();

      const documentsQuery = (() => {
        if (!isReset && lastDocument) {
          return articlesRef.startAfter(lastDocument.created);
        }
        return articlesRef;
      })();

      const snapshot = await documentsQuery.get();

      if (snapshot.docs.length > 0) {
        const docSnapshot = snapshot.docs[snapshot.docs.length - 1];
        const cursorDocument = docSnapshot.exists
          ? (docSnapshot.data() as FirestoreArticle)
          : undefined;

        const articles = snapshot.docs.map((doc) => {
          const data = doc.data();
          const parsedData = _flow(
            _update('created', (timestamp) => {
              const parsed = new firebase.firestore.Timestamp(
                timestamp.seconds,
                timestamp.nanoseconds,
              );
              return parsed.toDate();
            }),
            _update('updated', (timestamp) => {
              const parsed = new firebase.firestore.Timestamp(
                timestamp.seconds,
                timestamp.nanoseconds,
              );
              return parsed.toDate();
            }),
            _update('uid', (uid) => {
              return NxvTextEncyptor.encrypt(uid);
            }),
          )(data);
          return parsedData;
        }) as FirestoreArticle[];

        dispatch(
          success({
            articles,
            isReset,
            lastDocument: cursorDocument,
          }),
        );
      } else if (searchTag) {
        dispatch(
          success({
            articles: [],
            isReset,
            lastDocument: undefined,
          }),
        );
        dispatch(
          showMessage({
            messageCode: `message.article.search.empty`,
            severity: 'warning',
          }),
        );
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        dispatch(
          showMessage({
            messageCode: `error.http`,
            message: `${status}: ${data.detail}`,
            severity: 'error',
          }),
        );
        dispatch(failure(error.response.statusText));
      } else {
        dispatch(
          showMessage({
            messageCode: `error.custom`,
            message: error,
            severity: 'error',
          }),
        );
      }
    }
  };
}

export function fetchFirestoreAuthorArticleListThunk(
  uid: string,
): ExtendedThunkAction<ArticleListActionTypes> {
  return async (dispatch, _, firebase) => {
    const {
      request,
      success,
      failure,
    } = fetchFirestoreAuthorArticleListAsyncAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const ARTICLE_LIMIT = 5;
      const articlesRef = firestore
        .collection(ARTICLE_COLLECTION_NAME)
        .where('uid', '==', uid)
        .orderBy('created', 'desc')
        .limit(ARTICLE_LIMIT);

      const snapshot = await articlesRef.get();

      const articles = snapshot.docs.map((doc) => {
        const data = doc.data();
        const parsedData = _flow(
          _update('created', (timestamp) => {
            const parsed = new firebase.firestore.Timestamp(
              timestamp.seconds,
              timestamp.nanoseconds,
            );
            return parsed.toDate();
          }),
          _update('updated', (timestamp) => {
            const parsed = new firebase.firestore.Timestamp(
              timestamp.seconds,
              timestamp.nanoseconds,
            );
            return parsed.toDate();
          }),
          _update('uid', (rawUID) => {
            return NxvTextEncyptor.encrypt(rawUID);
          }),
        )(data);
        return parsedData;
      }) as FirestoreArticle[];

      dispatch(success(articles));
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        dispatch(
          showMessage({
            messageCode: `error.http`,
            message: `${status}: ${data.detail}`,
            severity: 'error',
          }),
        );
        dispatch(failure(error.response.statusText));
      }
    }
  };
}
