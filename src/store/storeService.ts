import { Store } from 'redux';
import { RootState } from './rootReducer';

let _store: Store<RootState>;

export function registerStore(store: Store<RootState>) {
  _store = store;
}

export function getStore() {
  return _store;
}

export function getState() {
  return _store.getState();
}

export function dispatch(action: any) {
  return _store.dispatch(action);
}
