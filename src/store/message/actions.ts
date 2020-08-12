import { createAction } from 'typesafe-actions';

export type SeverityType = 'error' | 'warning' | 'info' | 'success';
export interface MessageConfig {
  messageCode: string;
  message?: string;
  severity?: SeverityType;
}

export const showMessage = createAction('message/SHOW')<MessageConfig>();
export const hideMessage = createAction('message/HIDE')<void>();

export type MessageActionTypes =
  | ReturnType<typeof showMessage>
  | ReturnType<typeof hideMessage>;
