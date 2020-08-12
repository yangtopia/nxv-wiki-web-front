import { replace } from 'connected-next-router/actions';
import NxvTextEncyptor from '@utils/encrypt-text';
import _delay from 'lodash/delay';

import { showMessage } from '@store/message';

import { NxvLocalStorage } from '@utils/nxv-local-storage';

import { FirestoreUserInfo } from '@models/firebase';
import { ExtendedThunkAction } from '@models/redux';

import {
  AuthActionTypes,
  logoutAsyncAction,
  firebaseEmailLoginLinkSendAsyncAction,
  firebaseEmailLinkLoginAsyncAction,
  setFirestoreUserInfoAsyncAction,
  setFirestoreUsernameAsyncAction,
} from './actions';

import { hideUsernameModal } from '../modal/actions';

export function firebaseLogoutThunk(): ExtendedThunkAction<AuthActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = logoutAsyncAction;
    dispatch(request());
    try {
      await firebase.auth().signOut();
      dispatch(success());
      dispatch(
        showMessage({
          messageCode: 'message.logout.success',
          severity: 'success',
        }),
      );
      // _delay(() => {
      //   window.location.href = '/';
      // }, 1500);
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'message.logout.failed',
          severity: 'error',
        }),
      );
      dispatch(failure(error));
    }
  };
}

export function firebaseEmailLoginLinkSendThunk(
  useremail: string,
): ExtendedThunkAction<AuthActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = firebaseEmailLoginLinkSendAsyncAction;
    dispatch(request());
    try {
      await firebase.auth().sendSignInLinkToEmail(useremail, {
        url: window.location.href,
        handleCodeInApp: true,
      });

      NxvLocalStorage.of(localStorage).setItem('nxv/emailForSignIn', useremail);

      dispatch(
        showMessage({
          messageCode: 'message.auth.login-link-sent',
          severity: 'success',
        }),
      );
      dispatch(success());
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

export function firebaseEmailLinkLoginThunk(
  emailLink: string,
): ExtendedThunkAction<AuthActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = firebaseEmailLinkLoginAsyncAction;
    dispatch(request());
    try {
      const auth = firebase.auth();
      const firestore = firebase.firestore();
      if (auth.isSignInWithEmailLink(emailLink)) {
        const nxvLocalStorage = NxvLocalStorage.of(localStorage);
        const promptedEmail = (() => {
          const email = nxvLocalStorage.getItem<string>('nxv/emailForSignIn');
          if (email) {
            return email;
          }
          // eslint-disable-next-line no-alert
          return window.prompt('로그인 링크를 받은 이메일 주소를 입력하세요.');
        })();
        if (promptedEmail) {
          const { user } = await auth.signInWithEmailLink(
            promptedEmail,
            window.location.href,
          );

          nxvLocalStorage.removeItem('nxv/emailForSignIn');
          dispatch(replace('/'));

          const docSnapshot = await firestore
            .collection('users')
            .doc(`${user?.uid}`)
            .get();

          if (docSnapshot.exists) {
            dispatch(success(docSnapshot.data() as FirestoreUserInfo));
          } else {
            const docRef = firestore.collection('users').doc(user?.uid);
            const userInfo = {
              uid: user?.uid as string,
              displayName: user?.displayName as string,
              email: user?.email as string,
              photoURL: user?.photoURL as string,
              username: '',
            };
            await docRef.set(userInfo);
            const encryptedUserInfo = {
              ...userInfo,
              uid: NxvTextEncyptor.encrypt(userInfo.uid),
            };
            dispatch(success(encryptedUserInfo));
          }
        }
      }
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'message.login.link-invalid',
          severity: 'error',
        }),
      );
      dispatch(failure(error));
    }
  };
}

export function setFirestoreUserInfoThunk(
  user: firebase.User,
): ExtendedThunkAction<AuthActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = setFirestoreUserInfoAsyncAction;
    dispatch(request());
    try {
      const documentSnapshot = await firebase
        .firestore()
        .collection('users')
        .doc(`${user.uid}`)
        .get();

      const firebaseUserInfo = documentSnapshot.data() ?? user;

      const encryptedUserInfo = {
        ...firebaseUserInfo,
        uid: NxvTextEncyptor.encrypt(user.uid),
      } as FirestoreUserInfo;

      dispatch(success(encryptedUserInfo));
    } catch (error) {
      dispatch(
        showMessage({
          messageCode: 'error.custom',
          message: `${error}`,
          severity: 'error',
        }),
      );
      dispatch(failure(error));
    }
  };
}

export function setFirestoreUsernameThunk(
  username: string,
): ExtendedThunkAction<AuthActionTypes> {
  return async (dispatch, _, firebase) => {
    const { request, success, failure } = setFirestoreUsernameAsyncAction;
    dispatch(request());
    try {
      const firestore = firebase.firestore();
      const currentUser = firebase.auth().currentUser as firebase.User;

      const collectionRef = firestore.collection('users');

      const docSnapshotOfSameUsername = await collectionRef
        .where('username', '==', username)
        .get();

      if (!docSnapshotOfSameUsername.empty) {
        throw new Error('nickname-occupied');
      } else {
        const docSnapshotOfUser = await collectionRef
          .where('uid', '==', currentUser.uid)
          .get();

        const userDocRef = docSnapshotOfUser.docs[0].ref;
        await userDocRef.update({
          username,
        });

        dispatch(success(username));
        dispatch(hideUsernameModal());
        dispatch(
          showMessage({
            messageCode: 'message.auth.set-nickname',
            severity: 'success',
          }),
        );
      }
    } catch (error) {
      if (error.message) {
        dispatch(
          showMessage({
            messageCode: `message.auth.${error.message}`,
            severity: 'warning',
          }),
        );
      }
      dispatch(failure(error));
    }
  };
}
