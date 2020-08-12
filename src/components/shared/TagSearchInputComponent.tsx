import React, { KeyboardEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import router from 'next/router';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import _debounce from 'lodash/debounce';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { SearchOutlined, CancelOutlined } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useBloc } from '@hooks/useBloc';
import {
  SearchTagState,
  SearchTagBloc,
  SearchTagBlocContext,
} from '@blocs/searchTag';
import { fetchFirestoreArticleListThunk } from '@store/articleList';
import { showMessage } from '@store/message';
import { selectIsLoggedIn } from '@store/auth';
import {
  selectSearchedArticleTags,
  fetchArticleTagsThunk,
  selectIsTagLoading,
} from '@store/article';

const SearchInputWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled(TextField)`
  & > * {
    font-size: 14px;
  }
`;

const AutoCompleteStyled = styled(Autocomplete).attrs({
  freeSolo: true,
  disableClearable: true,
  autoHighlight: true,
})`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  width: 200px;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    width: 85%;
  }
`;

const debouncedCallback = _debounce((callback: () => void) => {
  callback();
}, 1000);

const TagSearchInputComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [currentTag, setCurrentTag] = useState('');
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const searchedTags = useSelector(selectSearchedArticleTags);
  const isTagLoading = useSelector(selectIsTagLoading);

  const [{ searchTag, isSearching }, searchTagBloc] = useBloc<
    SearchTagState,
    SearchTagBloc
  >(SearchTagBlocContext);

  useEffect(() => {
    setCurrentTag(searchTag);
  }, [searchTag]);

  const handleSearchSubmit = (tag: string) => {
    if (!isLoggedIn) {
      dispatch(
        showMessage({
          messageCode: 'message.login.need',
          severity: 'warning',
        }),
      );
      return;
    }
    if (_isEmpty(tag.trim())) {
      dispatch(
        showMessage({
          messageCode: 'message.article.search.need-tag',
          severity: 'warning',
        }),
      );
    } else {
      searchTagBloc.setTag(tag);
      searchTagBloc.setIsSearching(true);
      dispatch(
        fetchFirestoreArticleListThunk({
          isReset: true,
          searchTag: currentTag,
        }),
      );
      router.push(`/?searchTag=${currentTag}`);
    }
  };

  const onClickSearch = () => {
    handleSearchSubmit(currentTag);
  };

  const onKeyDownSearchInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (searchedTags.indexOf(currentTag) > -1) {
        handleSearchSubmit(currentTag);
      }
    }
  };

  const onClickCancel = () => {
    searchTagBloc.setIsSearching(false);
    searchTagBloc.reset();
    setCurrentTag('');
    dispatch(fetchFirestoreArticleListThunk({ isReset: true }));
    router.replace('/');
  };

  return (
    <SearchInputWrap>
      <AutoCompleteStyled
        loading={isTagLoading}
        options={searchedTags}
        defaultValue=""
        inputValue={currentTag}
        onInputChange={(e, value) => {
          setCurrentTag(value);
          debouncedCallback(() => {
            if (value.length > 1) {
              dispatch(fetchArticleTagsThunk(value));
            }
          });
        }}
        onKeyDown={onKeyDownSearchInput}
        renderInput={(params) => (
          <SearchInput
            {...params}
            variant="outlined"
            placeholder="태그 검색"
            size="small"
            onChange={(e) => setCurrentTag(e.target.value)}
          />
        )}
      />
      <Tooltip title="검색">
        <IconButton onClick={onClickSearch}>
          <SearchOutlined style={{ fontSize: '20px' }} />
        </IconButton>
      </Tooltip>
      {isSearching && (
        <Tooltip title="초기화">
          <IconButton onClick={onClickCancel}>
            <CancelOutlined style={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip>
      )}
    </SearchInputWrap>
  );
};

export default TagSearchInputComponent;
