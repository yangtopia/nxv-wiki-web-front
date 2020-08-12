import { createAsyncAction, ActionType } from 'typesafe-actions';
import { FirestoreUserInfo } from '@models/firebase';

export const logoutAsyncAction = createAsyncAction(
  'auth/LOG_OUT_REQUEST',
  'auth/LOG_OUT_SUCCESS',
  'auth/LOG_OUT_FAILURE',
)<void, void, any>();

export const firebaseEmailLoginLinkSendAsyncAction = createAsyncAction(
  'auth/FIREBASE_EMAIL_LOGIN_LINK_SEND_REQUEST',
  'auth/FIREBASE_EMAIL_LOGIN_LINK_SEND_SUCCESS',
  'auth/FIREBASE_EMAIL_LOGIN_LINK_SEND_FAILURE',
)<void, void, any>();

export const firebaseEmailLinkLoginAsyncAction = createAsyncAction(
  'auth/FIREBASE_EMAIL_LINK_LOGIN_REQEUST',
  'auth/FIREBASE_EMAIL_LINK_LOGIN_SUCCESS',
  'auth/FIREBASE_EMAIL_LINK_LOGIN_FAILURE',
)<void, FirestoreUserInfo, any>();

export const setFirestoreUserInfoAsyncAction = createAsyncAction(
  'auth/SET_FIRESTORE_USERINFO_REQUEST',
  'auth/SET_FIRESTORE_USERINFO_SUCCESS',
  'auth/SET_FIRESTORE_USERINFO_FAILURE',
)<void, FirestoreUserInfo, any>();

export const setFirestoreUsernameAsyncAction = createAsyncAction(
  'auth/SET_FIRESTORE_USERNAME_REQUEST',
  'auth/SET_FIRESTORE_USERNAME_REQUEST',
  'auth/SET_FIRESTORE_USERNAME_REQUEST',
)<void, string, any>();

export type AuthActionTypes =
  | ActionType<typeof logoutAsyncAction>
  | ActionType<typeof setFirestoreUserInfoAsyncAction>
  | ActionType<typeof firebaseEmailLoginLinkSendAsyncAction>
  | ActionType<typeof firebaseEmailLinkLoginAsyncAction>
  | ActionType<typeof setFirestoreUsernameAsyncAction>;
