import { createSelector } from 'reselect';
import NxvTextEncyptor from '@utils/encrypt-text';
import { FirestoreUserInfo } from '@models/firebase';
import { RootState } from '../rootReducer';

export const authSelector = (state: RootState) => state.auth;

export const selectIsLoggedIn = createSelector(
  [authSelector],
  (authState) => authState.isLoggedIn,
);

export const selectFirestoreUserInfo = createSelector(
  [authSelector],
  (authState) => {
    const { userInfo } = authState;
    const decryptedUIDUserInfo: FirestoreUserInfo | undefined = (() => {
      if (userInfo && userInfo.uid) {
        return {
          ...userInfo,
          uid: NxvTextEncyptor.decrypt(userInfo.uid),
        };
      }
      return undefined;
    })();
    return decryptedUIDUserInfo;
  },
);
