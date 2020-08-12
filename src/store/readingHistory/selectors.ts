import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';

export const readingHistorySelector = (state: RootState) =>
  state.readingHistory;

export const selectReadingHistoryList = createSelector(
  [readingHistorySelector],
  (readingHistoryState) => readingHistoryState.list,
);
