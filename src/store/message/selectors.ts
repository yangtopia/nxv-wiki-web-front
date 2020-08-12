import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';

export const messageSelector = (state: RootState) => state.message;

export const selectMesssage = createSelector(
  [messageSelector],
  (messageState) => messageState,
);
