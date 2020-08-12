import { createReducer } from 'typesafe-actions';
import { ReadingHistoryListItemProps } from '@components/aside/readingHistory/ReadingHistoryListItemComponent';
import {
  getReadingHistoryListAsyncAction,
  ReadingHistoryActionTypes,
} from './actions';

export interface ReadingHistoryState {
  isLoading: boolean;
  list: ReadingHistoryListItemProps[];
  error: any;
}

const INITIAL_STATE: ReadingHistoryState = {
  isLoading: false,
  list: [],
  error: null,
};

const reducer = createReducer<ReadingHistoryState, ReadingHistoryActionTypes>(
  INITIAL_STATE,
)
  .handleAction(getReadingHistoryListAsyncAction.request, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(getReadingHistoryListAsyncAction.success, (state, action) => ({
    ...state,
    isLoading: false,
    list: action.payload,
  }))
  .handleAction(getReadingHistoryListAsyncAction.failure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }));

export default reducer;
