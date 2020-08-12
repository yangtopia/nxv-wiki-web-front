import { createAction } from 'typesafe-actions';

export const showLoginModal = createAction('modal/SHOW_LOGIN_MODAL')();
export const hideLoginModal = createAction('modal/HIDE_LOGIN_MODAL')();
export const showUsernameModal = createAction('modal/SHOW_USERNAME_MODAL')();
export const hideUsernameModal = createAction('modal/HIDE_USERNAME_MODAL')();
export const showBrowserWarnModal = createAction(
  'modal/SHOW_BROWSER_WARN_MODAL',
)();
export const hideBrowserWarnModal = createAction(
  'modal/HIDE_BROWSER_WARN_MODAL',
)();

export type ModalActionTypes =
  | ReturnType<typeof showLoginModal>
  | ReturnType<typeof hideLoginModal>
  | ReturnType<typeof showUsernameModal>
  | ReturnType<typeof hideUsernameModal>
  | ReturnType<typeof showBrowserWarnModal>
  | ReturnType<typeof hideBrowserWarnModal>;
