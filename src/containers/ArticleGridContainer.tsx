import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import Fade from 'react-reveal/Fade';

import {
  fetchFirestoreArticleListThunk,
  selectFirestoreArticleList,
  selectIsArticleListLoaded,
} from '@store/articleList';

import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ArticleGridComponent } from '@components/articleGrid';
import { MainPageProps } from 'pages/index';
import { useBloc } from '@hooks/useBloc';
import {
  SearchTagBlocContext,
  SearchTagState,
  SearchTagBloc,
} from '@blocs/searchTag';
import { TagSearchInputComponent } from '@components/shared';
import { useMediaQuery } from '@material-ui/core';
import { selectIsLoggedIn } from '@store/auth';

const ArticleGridContainerWrap = styled.article`
  width: 100%;
  margin-right: 20px;
  padding: 15px;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    margin: 0;
  }
`;

const SearchWrap = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    flex-direction: column-reverse;
    margin-bottom: ${(props) => props.theme.spacing(1)}px;
  }
`;

const EmptyWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    flex-direction: column;
  }
`;

const SearchTextResult = styled.h2``;

const ArticleGridContainer: React.FC<MainPageProps> = ({
  searchTag: initialSearchTag,
}) => {
  const dispatch = useDispatch();
  const articleList = useSelector(selectFirestoreArticleList);
  const isLoadedArticleList = useSelector(selectIsArticleListLoaded);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [{ searchTag, isSearching }, searchTagBloc] = useBloc<
    SearchTagState,
    SearchTagBloc
  >(SearchTagBlocContext);

  useEffect(() => {
    searchTagBloc.setTag(initialSearchTag || '');
    searchTagBloc.setIsSearching(!_isEmpty(initialSearchTag));
    dispatch(
      fetchFirestoreArticleListThunk({
        isReset: true,
        searchTag: initialSearchTag,
      }),
    );
  }, []);

  const [_, setIsFetching] = useInfiniteScroll({
    callback: () => {
      dispatch(fetchFirestoreArticleListThunk({ isReset: false }));
      setIsFetching(false);
    },
    threshold: 500,
  });

  const isShowTagInput = useMediaQuery('(max-width: 960px)');

  return (
    <ArticleGridContainerWrap>
      <SearchWrap>
        {isSearching && (
          <SearchTextResult>검색결과: #{searchTag}</SearchTextResult>
        )}
        {isShowTagInput && isLoggedIn && <TagSearchInputComponent />}
      </SearchWrap>
      {isLoadedArticleList && articleList.length === 0 ? (
        <EmptyWrap>
          <Fade>
            <img src="/images/empty.png" alt="No data" height="200" />
            <h2>
              검색 결과가 없습니다.&nbsp;
              <span role="img" aria-label="crying">
                😥
              </span>
            </h2>
          </Fade>
        </EmptyWrap>
      ) : (
        <ArticleGridComponent articles={articleList} />
      )}
    </ArticleGridContainerWrap>
  );
};

export default ArticleGridContainer;
