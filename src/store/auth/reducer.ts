import { createReducer } from 'typesafe-actions';
import { FirestoreUserInfo } from '@models/firebase';
import {
  AuthActionTypes,
  logoutAsyncAction,
  firebaseEmailLoginLinkSendAsyncAction,
  firebaseEmailLinkLoginAsyncAction,
  setFirestoreUserInfoAsyncAction,
  setFirestoreUsernameAsyncAction,
} from './actions';

export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  userInfo?: FirestoreUserInfo;
  error: any;
}

const INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const reducer = createReducer<AuthState, AuthActionTypes>(INITIAL_STATE)
  .handleAction(logoutAsyncAction.success, (state) => ({
    ...state,
    isLoggedIn: false,
    isLoading: true,
    userInfo: undefined,
  }))
  .handleAction(logoutAsyncAction.failure, (state) => ({
    ...state,
  }))
  .handleAction(
    setFirestoreUsernameAsyncAction.success,
    (state, { payload }) => {
      const copy = { ...state.userInfo } as FirestoreUserInfo;
      copy.username = payload;
      return {
        ...state,
        userInfo: copy,
      };
    },
  )
  .handleAction(firebaseEmailLoginLinkSendAsyncAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(firebaseEmailLoginLinkSendAsyncAction.success, (state) => ({
    ...state,
    isLoginModalOpen: false,
    isLoading: false,
    isLoggedIn: false,
  }))
  .handleAction(
    firebaseEmailLoginLinkSendAsyncAction.failure,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: payload,
    }),
  )
  .handleAction(firebaseEmailLinkLoginAsyncAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(
    firebaseEmailLinkLoginAsyncAction.success,
    (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        userInfo: payload,
      };
    },
  )
  .handleAction(
    firebaseEmailLinkLoginAsyncAction.failure,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: payload,
    }),
  )
  .handleAction(setFirestoreUserInfoAsyncAction.request, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  })
  .handleAction(
    setFirestoreUserInfoAsyncAction.success,
    (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        isLoginModalOpen: false,
        userInfo: payload,
      };
    },
  )
  .handleAction(
    setFirestoreUserInfoAsyncAction.failure,
    (state, { payload }) => ({
      ...state,
      isLoading: false,
      error: payload,
    }),
  );

export default reducer;
