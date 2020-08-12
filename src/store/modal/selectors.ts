import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';

export const modalSeletor = (state: RootState) => state.modal;

export const selectIsLoginModalOpen = createSelector(
  [modalSeletor],
  (modalState) => modalState.isLoginModalOpen,
);

export const selectIsUsernameModalOpen = createSelector(
  [modalSeletor],
  (modalState) => modalState.isUsernameModalOpen,
);

export const selectIsBrowserWarnModalOpen = createSelector(
  [modalSeletor],
  (modalState) => modalState.isBrowserWarnModalOpen,
);
