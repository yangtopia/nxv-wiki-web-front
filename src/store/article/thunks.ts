import { push, replace } from 'connected-next-router';
import NxvTextEncyptor from '@utils/encrypt-text';

import _replace from 'lodash/replace';
import _keys from 'lodash/keys';
import _delay from 'lodash/delay';
import _set from 'lodash/set';
import _flow from 'lodash/flow';
import _update from 'lodash/update';
import _fpUpdate from 'lodash/fp/update';
import _tail from 'lodash/tail';

import {
  ARTICLE_TEMP_COLLECTION_NAME,
  ARTICLE_COLLECTION_NAME,
  ARTICLE_TAG_COLLECTION_NAME,
} from '@services/initFirebase';

import { showMessage, hideMessage, MessageConfig } from '@store/message';

import {
  FirestoreArticle,
  FirestoreGetArticleReqParams,
  FirestoreDeleteArticleReqParams,
} from '@models/firebase';
import { ExtendedThunkAction } from '@models/redux';

import {
  ArticleActionTypes,
  fetchFirestoreArticleAction,
  deleteFirestoreArticleAction,
  createFirestoreArticleAction,
  updateFirestoreArticleAction,
  updateArticleClapCountAction,
  updateArticleTagsAction,
  fetchArticleTagsAction,
  updateArticleActiveAction,
  updateArticleViewCountAction,
} from './actions';

export function fetchFirestoreArticleThunk(
  params: FirestoreGetArticleReqParams,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = fetchFirestoreArticleAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const { username, slug, isEditing = false } = params;

      const articlesRef = firestore.collection(ARTICLE_COLLECTION_NAME);

      const querySnapshot = await (async () => {
        const query = articlesRef.where('slug', '==', slug);
        if (isEditing) {
          const { currentUser } = firebase.auth();
          return query.where('uid', '==', currentUser?.uid).get();
        }
        return query.where('username', '==', _replace(username, '@', '')).get();
      })();

      const article = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const parsedData = _flow(
          _fpUpdate('created', (timestamp) => {
            const parsed = new firebase.firestore.Timestamp(
              timestamp.seconds,
              timestamp.nanoseconds,
            );
            return parsed.toDate();
          }),
          _fpUpdate('updated', (timestamp) => {
            const parsed = new firebase.firestore.Timestamp(
              timestamp.seconds,
              timestamp.nanoseconds,
            );
            return parsed.toDate();
          }),
          _fpUpdate('uid', (uid) => {
            return NxvTextEncyptor.encrypt(uid);
          }),
        )(data) as FirestoreArticle;

        return parsedData;
      })[0];

      dispatch(success(article));
      dispatch(hideMessage());
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        dispatch(
          showMessage({
            messageCode: 'error.http',
            message: `${status}: ${data.detail}`,
            severity: 'error',
          }),
        );
      } else {
        dispatch(
          showMessage({
            messageCode: 'error.http',
            message: `${error}`,
            severity: 'error',
          }),
        );
      }
      dispatch(failure(error));
    }
  };
}

export function deleteFirestoreArticleThunk(
  params: FirestoreDeleteArticleReqParams,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = deleteFirestoreArticleAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const { username, slug } = params;

      const articlesRef = firestore.collection(ARTICLE_COLLECTION_NAME);
      const querySnapshot = await articlesRef
        .where('username', '==', _replace(username, '@', ''))
        .where('slug', '==', slug)
        .get();

      const docRef = querySnapshot.docs[0].ref;
      await docRef.delete();

      dispatch(success());
      dispatch(
        showMessage({
          messageCode: 'message.article.delete.success',
          severity: 'success',
        }),
      );
      dispatch(replace('/'));
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'error.default',
          severity: 'error',
        }),
      );
      dispatch(failure(error));
    }
  };
}

export function updateArticleTagThunk(
  tags: string[],
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = updateArticleTagsAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection(ARTICLE_TAG_COLLECTION_NAME);
      tags.forEach(async (tag) => {
        const docRef = await collectionRef.where('tag', '==', tag).get();
        const tokens = _tail(
          tag.split('').reduce<string[]>((prev, curr, idx) => {
            if (prev.length) {
              const first = prev[idx - 1];
              const token = `${first}${curr}`;
              prev.push(token);
            } else {
              prev.push(curr);
            }
            return prev;
          }, []),
        );
        if (docRef.empty) {
          collectionRef.doc().set({
            tag,
            tokens,
          });
        }
      });
      dispatch(success());
    } catch (error) {
      dispatch(failure(error));
    }
  };
}

export function fetchArticleTagsThunk(
  searchTag: string,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = fetchArticleTagsAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const collectionRef = await firestore
        .collection(ARTICLE_TAG_COLLECTION_NAME)
        .where('tokens', 'array-contains', searchTag)
        .limit(10)
        .get();
      const result = collectionRef.docs.map((doc) => {
        return doc.data().tag;
      });
      dispatch(success(result));
    } catch (error) {
      dispatch(failure(error));
    }
  };
}

export function createFirestoreArticleThunk(
  article: FirestoreArticle,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { slug } = article;
    const { request, success, failure } = createFirestoreArticleAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const auth = firebase.auth();

      if (!auth.currentUser) {
        throw new Error('login-needed');
      }

      const querySnapshot = await firestore
        .collection(ARTICLE_COLLECTION_NAME)
        .where('username', '==', article.username)
        .where('slug', '==', slug)
        .get();

      if (!querySnapshot.empty) {
        throw new Error('slug');
      }

      const docRef = firestore.collection(ARTICLE_COLLECTION_NAME).doc();

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await docRef.set({
        ...article,
        uid: auth.currentUser.uid,
        created: timestamp,
        updated: timestamp,
      });

      await firestore
        .collection(ARTICLE_TEMP_COLLECTION_NAME)
        .doc(auth.currentUser.uid)
        .delete();

      dispatch(success());
      dispatch(
        showMessage({
          messageCode: 'message.article.publish.success',
          severity: 'success',
        }),
      );

      dispatch(push('/[owner]/[slug]', `/@${article.username}/${slug}`));
    } catch (error) {
      if (error.message) {
        dispatch(
          showMessage({
            messageCode: `message.article.error.${error.message}`,
          }),
        );
      } else {
        const showMessageConfig: MessageConfig = (() => {
          if (error.response) {
            const { data } = error.response;
            const errorCode = _keys(data)[0];
            return {
              messageCode: `message.article.error.${errorCode}`,
            };
          }
          return {
            messageCode: 'error.custom',
            message: `${error}`,
          };
        })();
        dispatch(showMessage({ ...showMessageConfig, severity: 'error' }));
      }
      dispatch(failure(error));
    }
  };
}

export function updateFirestoreArticleThunk(
  currentArticle: FirestoreArticle,
  updateArticle: FirestoreArticle,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = updateFirestoreArticleAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const { currentUser } = firebase.auth();
      const { slug: previousSlug } = currentArticle;
      const { username, slug } = updateArticle;

      const articlesRef = firestore.collection(ARTICLE_COLLECTION_NAME);
      const querySnapshot = await articlesRef
        .where('uid', '==', currentUser?.uid)
        .where('slug', '==', previousSlug)
        .get();

      const docRef = querySnapshot.docs[0].ref;
      await docRef.update({
        ...updateArticle,
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      });

      dispatch(success());
      dispatch(
        showMessage({
          messageCode: 'message.article.edit.success',
          severity: 'success',
        }),
      );
      dispatch(push('/[owner]/[slug]', `/@${username}/${slug}`));
    } catch (error) {
      const showMessageConfig: MessageConfig = (() => {
        if (error.response) {
          const { data } = error.response;
          const errorCode = _keys(data)[0];
          return {
            messageCode: `message.article.error.${errorCode}`,
          };
        }
        return {
          messageCode: 'error.custom',
          message: `${error}`,
        };
      })();
      dispatch(showMessage({ ...showMessageConfig, severity: 'error' }));
      dispatch(failure(error));
    }
  };
}

export function updateArticleClapCountThunk(
  article: FirestoreArticle,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = updateArticleClapCountAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const { username, slug } = article;

      const articlesRef = firestore.collection(ARTICLE_COLLECTION_NAME);
      const querySnapshot = await articlesRef
        .where('username', '==', username)
        .where('slug', '==', slug)
        .get();

      const docRef = querySnapshot.docs[0].ref;
      const docSnapshot = await docRef.get();
      const previousClaps = docSnapshot.get('claps') as number;
      const currentClaps = previousClaps + 1;
      await docRef.update({
        claps: currentClaps,
      });

      const previousArticle = docSnapshot.data() as FirestoreArticle;
      const clapsUpdatedArticle: FirestoreArticle = _update(
        previousArticle,
        'claps',
        (value: number) => {
          return value + 1;
        },
      );

      const parsedData = _flow(
        _fpUpdate('created', (timestamp) => {
          const parsed = new firebase.firestore.Timestamp(
            timestamp.seconds,
            timestamp.nanoseconds,
          );
          return parsed.toDate();
        }),
        _fpUpdate('updated', (timestamp) => {
          const parsed = new firebase.firestore.Timestamp(
            timestamp.seconds,
            timestamp.nanoseconds,
          );
          return parsed.toDate();
        }),
        _fpUpdate('uid', (uid) => {
          return NxvTextEncyptor.encrypt(uid);
        }),
      )(clapsUpdatedArticle);

      dispatch(success(parsedData));
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'error.custom',
          message: `${error}`,
        }),
      );
      dispatch(failure(error));
    }
  };
}

export function updateArticleViewCountThunk(
  article: FirestoreArticle,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = updateArticleViewCountAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const { username, slug } = article;

      const articlesRef = firestore.collection(ARTICLE_COLLECTION_NAME);
      const querySnapshot = await articlesRef
        .where('username', '==', username)
        .where('slug', '==', slug)
        .get();

      const docRef = querySnapshot.docs[0].ref;
      const docSnapshot = await docRef.get();
      const previousViewCount = docSnapshot.get('viewCount') as number;
      const currentViewCount = previousViewCount + 1;
      await docRef.update({
        viewCount: currentViewCount,
      });

      const previousArticle = docSnapshot.data() as FirestoreArticle;
      const viewCountUpdatedArticle: FirestoreArticle = _update(
        previousArticle,
        'viewCount',
        (value: number) => {
          return value + 1;
        },
      );

      const parsedData = _flow(
        _fpUpdate('created', (timestamp) => {
          const parsed = new firebase.firestore.Timestamp(
            timestamp.seconds,
            timestamp.nanoseconds,
          );
          return parsed.toDate();
        }),
        _fpUpdate('updated', (timestamp) => {
          const parsed = new firebase.firestore.Timestamp(
            timestamp.seconds,
            timestamp.nanoseconds,
          );
          return parsed.toDate();
        }),
        _fpUpdate('uid', (uid) => {
          return NxvTextEncyptor.encrypt(uid);
        }),
      )(viewCountUpdatedArticle);

      dispatch(success(parsedData));
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'error.custom',
          message: `${error}`,
        }),
      );
      dispatch(failure(error));
    }
  };
}

export function updateArticleActiveThunk(
  isActive: boolean,
  article: FirestoreArticle,
): ExtendedThunkAction<ArticleActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = updateArticleActiveAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const { currentUser } = firebase.auth();
      const { slug } = article;

      const articlesRef = firestore.collection(ARTICLE_COLLECTION_NAME);
      const querySnapshot = await articlesRef
        .where('uid', '==', currentUser?.uid)
        .where('slug', '==', slug)
        .get();

      const docRef = querySnapshot.docs[0].ref;
      await docRef.update({
        isActive,
      });
      dispatch(success());
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'error.custom',
          message: `${error}`,
        }),
      );
      dispatch(failure(error));
    }
  };
}
