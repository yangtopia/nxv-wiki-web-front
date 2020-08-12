import { createContext } from 'react';
import { Bloc } from '../abstractBloc';

export interface SearchTagState {
  searchTag: string;
  isSearching: boolean;
}

export class SearchTagBloc extends Bloc<SearchTagState> {
  setTag = (searchTag: string) => {
    this.state$.next({
      ...this.getState,
      searchTag,
    });
  };

  setIsSearching = (isSearching: boolean) => {
    this.state$.next({
      ...this.getState,
      isSearching,
    });
  };
}

export const SearchTagBlocContext = createContext<SearchTagBloc>(
  new SearchTagBloc({
    searchTag: '',
    isSearching: false,
  }),
);
