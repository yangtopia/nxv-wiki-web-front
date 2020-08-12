import { createReducer } from 'typesafe-actions';
import {
  MessageActionTypes,
  showMessage,
  hideMessage,
  SeverityType,
} from './actions';

export interface MessageState {
  isOpen: boolean;
  severity: SeverityType;
  messageCode: string;
  message?: string;
}

const INITIAL_STATE: MessageState = {
  isOpen: false,
  messageCode: 'error.default',
  message: '',
  severity: 'info',
};

const reducer = createReducer<MessageState, MessageActionTypes>(INITIAL_STATE)
  .handleAction(showMessage, (state, action) => {
    return {
      ...state,
      isOpen: true,
      severity: action.payload.severity || 'info',
      message: action.payload.message || '',
      messageCode: action.payload.messageCode,
    };
  })
  .handleAction(hideMessage, (state) => ({
    ...state,
    isOpen: false,
  }));

export default reducer;
