import { createAsyncAction, ActionType } from 'typesafe-actions';
import { ReadingHistoryListItemProps } from '@components/aside/readingHistory/ReadingHistoryListItemComponent';

const GET_READING_HISTORY_LIST = 'GET_READING_HISTORY_LIST';
const GET_READING_HISTORY_LIST_SUCCESS = 'GET_READING_HISTORY_LIST_SUCCESS';
const GET_READING_HISTORY_LIST_ERROR = 'GET_READING_HISTORY_LIST_ERROR';

export const getReadingHistoryListAsyncAction = createAsyncAction(
  GET_READING_HISTORY_LIST,
  GET_READING_HISTORY_LIST_SUCCESS,
  GET_READING_HISTORY_LIST_ERROR,
)<void, ReadingHistoryListItemProps[], any>();

export type ReadingHistoryActionTypes = ActionType<
  typeof getReadingHistoryListAsyncAction
>;
