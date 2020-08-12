import { NxvLocalStorage } from '@utils/nxv-local-storage';
import { ReadingHistoryListItemProps } from '@components/aside/readingHistory/ReadingHistoryListItemComponent';
import { ExtendedThunkAction } from '@models/redux';
import {
  getReadingHistoryListAsyncAction,
  ReadingHistoryActionTypes,
} from './actions';

export function getReadingHistoryListThunk(): ExtendedThunkAction<
  ReadingHistoryActionTypes
> {
  return async (dispatch) => {
    const { request, success, failure } = getReadingHistoryListAsyncAction;
    dispatch(request());
    try {
      const readingHistoryList = NxvLocalStorage.of(localStorage).getItem<
        ReadingHistoryListItemProps[]
      >('nxv/reading-history');
      if (readingHistoryList) {
        dispatch(success(readingHistoryList));
      }
    } catch (error) {
      dispatch(failure(error));
    }
  };
}
