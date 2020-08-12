import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { CallRouterMethodAction } from 'connected-next-router/actions';
import firebase from 'firebase';

import { RootState } from '@store/rootReducer';
import { MessageActionTypes } from '@store/message';
import { ModalActionTypes } from '@store/modal';

export type ExtendedThunkAction<T extends AnyAction> = ThunkAction<
  void,
  RootState,
  typeof firebase,
  T | ModalActionTypes | MessageActionTypes | CallRouterMethodAction
>;
