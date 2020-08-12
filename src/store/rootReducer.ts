import { combineReducers } from 'redux';
import { routerReducer } from 'connected-next-router';

import readingHistory, { ReadingHistoryState } from './readingHistory/reducer';
import articleList, { ArticleListState } from './articleList/reducer';
import message, { MessageState } from './message/reducer';
import article, { ArticleState } from './article/reducer';
import auth, { AuthState } from './auth/reducer';
import modal, { ModalState } from './modal/reducer';

export interface RootState {
  readingHistory: ReadingHistoryState;
  articleList: ArticleListState;
  article: ArticleState;
  message: MessageState;
  auth: AuthState;
  router: ReturnType<typeof routerReducer>;
  modal: ModalState;
}

const rootReducer = combineReducers<RootState>({
  readingHistory,
  articleList,
  article,
  message,
  auth,
  router: routerReducer,
  modal,
});

export default rootReducer;
