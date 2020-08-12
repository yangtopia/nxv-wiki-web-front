import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Box, Paper } from '@material-ui/core';

import {
  FooterComponent,
  ReadingHistoryListComponent,
  AuthorArticlesListComponent,
} from '@components/aside';

import {
  selectReadingHistoryList,
  getReadingHistoryListThunk,
} from '@store/readingHistory';
import { selectFirestoreArticle } from '@store/article';
import { TextOverflowEllipsis } from '@styles/styled-mixins';
import {
  fetchFirestoreAuthorArticleListThunk,
  selectAuthorArticleList,
} from '@store/articleList';

const AsideContainerWrap = styled.aside`
  min-width: 280px;
  position: relative;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    display: none;
  }
`;

const FloatingWrap = styled.section`
  min-width: inherit;
  padding: 20px;
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledCard = styled(Paper).attrs({
  elevation: 0,
})`
  background-color: transparent;
  max-width: 240px;
  padding: ${(props) => props.theme.spacing(3)}px;
  margin-bottom: ${(props) => props.theme.spacing(3)}px;
`;

const StyledAvatar = styled(Avatar)`
  background-color: ${(props) => props.theme.color['nxv-down-yellow']};
  width: ${(props) => props.theme.spacing(8)}px;
  height: ${(props) => props.theme.spacing(8)}px;
  font-size: ${(props) => props.theme.spacing(3)}px;
  font-weight: bold;
`;

const StyledUsername = styled.h3`
  width: 100%;
  text-align: center;
  ${TextOverflowEllipsis};
`;

interface Props {
  isShowAuthorProfile?: boolean;
}

const AsideContainer: React.FC<Props> = ({ isShowAuthorProfile }) => {
  const readingHistoryList = useSelector(selectReadingHistoryList);
  const dispatch = useDispatch();
  const article = useSelector(selectFirestoreArticle);
  const authorArticles = useSelector(selectAuthorArticleList);

  useEffect(() => {
    dispatch(getReadingHistoryListThunk());
    if (isShowAuthorProfile && article) {
      dispatch(fetchFirestoreAuthorArticleListThunk(article.uid));
    }
  }, []);

  return (
    <AsideContainerWrap>
      <FloatingWrap>
        <section>
          {isShowAuthorProfile && (
            <StyledCard>
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
              >
                <StyledAvatar
                  alt={article?.username}
                  src={article?.avatarImageUrl}
                >
                  {article?.username.substr(0, 1).toUpperCase()}
                </StyledAvatar>
                <StyledUsername>{article?.username}</StyledUsername>
              </Box>
            </StyledCard>
          )}
          {isShowAuthorProfile ? (
            <AuthorArticlesListComponent authorArticles={authorArticles} />
          ) : (
            <ReadingHistoryListComponent historyList={readingHistoryList} />
          )}
        </section>
        <FooterComponent />
      </FloatingWrap>
    </AsideContainerWrap>
  );
};

export default AsideContainer;
