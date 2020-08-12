import { createReducer } from 'typesafe-actions';
import {
  showLoginModal,
  hideLoginModal,
  showUsernameModal,
  hideUsernameModal,
  showBrowserWarnModal,
  hideBrowserWarnModal,
  ModalActionTypes,
} from './actions';

export interface ModalState {
  isLoginModalOpen: boolean;
  isUsernameModalOpen: boolean;
  isBrowserWarnModalOpen: boolean;
  isLoading: boolean;
  error: any;
}

const INITIAL_STATE: ModalState = {
  isLoginModalOpen: false,
  isUsernameModalOpen: false,
  isBrowserWarnModalOpen: false,
  isLoading: false,
  error: null,
};

const reducer = createReducer<ModalState, ModalActionTypes>(INITIAL_STATE)
  .handleAction(showLoginModal, (state) => {
    return {
      ...state,
      isLoginModalOpen: true,
    };
  })
  .handleAction(hideLoginModal, (state) => ({
    ...state,
    isLoginModalOpen: false,
  }))
  .handleAction(showUsernameModal, (state) => {
    return {
      ...state,
      isUsernameModalOpen: true,
    };
  })
  .handleAction(hideUsernameModal, (state) => ({
    ...state,
    isUsernameModalOpen: false,
  }))
  .handleAction(showBrowserWarnModal, (state) => {
    return {
      ...state,
      isBrowserWarnModalOpen: true,
    };
  })
  .handleAction(hideBrowserWarnModal, (state) => ({
    ...state,
    isBrowserWarnModalOpen: false,
  }));

export default reducer;
