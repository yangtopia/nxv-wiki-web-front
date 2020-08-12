import { createStore, compose, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import {
  createRouterMiddleware,
  initialRouterState,
} from 'connected-next-router';

import firebase from '@services/initFirebase';

import rootReducer, { RootState } from './rootReducer';
import { registerStore } from './storeService';

const routerMiddleware = createRouterMiddleware();

const middlewares = [
  thunkMiddleware.withExtraArgument(firebase),
  routerMiddleware,
];

const enhancer =
  process.env.NODE_ENV !== 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools({})(applyMiddleware(...middlewares));

export default function configureStore(
  initialState = {},
  options: any,
): Store<RootState> {
  const modifiedInitialState = (() => {
    const copy: any = { ...initialState };
    if (options.asPath) {
      copy.router = initialRouterState(options.asPath);
    }
    return copy;
  })();
  const store = createStore(rootReducer, modifiedInitialState, enhancer);
  registerStore(store);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(require('./rootReducer').default);
    });
  }

  return store;
}
