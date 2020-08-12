import React, { useEffect, memo, useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import router from 'next/router';
import styled from 'styled-components';

import moment from 'moment';
import _keyBy from 'lodash/keyBy';
import _values from 'lodash/values';
import _get from 'lodash/get';

import { Create as CreateIcon, Delete as DeleteIcon } from '@material-ui/icons';
import {
  Button,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
} from '@material-ui/core';

import { ArticleDetailComponent } from '@components/articleDetail';
import ButtonWithConfirmComponent from '@components/shared/ButtonWithConfirmComponent';
import { FavoriteButtonComponent } from '@components/shared/motion';
import ErrorComponent from '@components/shared/ErrorComponent';
import { ReadingHistoryListItemProps } from '@components/aside/readingHistory/ReadingHistoryListItemComponent';

import {
  selectFirestoreArticle,
  deleteFirestoreArticleThunk,
  updateArticleClapCountThunk,
  updateArticleActiveThunk,
  updateArticleViewCountThunk,
} from '@store/article';
import { selectFirestoreUserInfo, selectIsLoggedIn } from '@store/auth';

import { NxvLocalStorage } from '@utils/nxv-local-storage';
import { ArticleLayoutResponsiveWidth } from '@styles/styled-mixins';
import { useBloc } from '@hooks/useBloc';
import {
  SearchTagState,
  SearchTagBloc,
  SearchTagBlocContext,
} from '@blocs/searchTag';
import { showMessage } from '@store/message';

const ArticleDetailContainerWrap = styled(Box).attrs({
  component: 'article',
})`
  width: 100%;
  padding: 20px 10px 100px;
`;

const DescWrap = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  ${ArticleLayoutResponsiveWidth}
  @media (min-width: ${(props) =>
    props.theme.breakPoint.xs}) and (max-width: ${(props) =>
  props.theme.breakPoint.md}) {
  }
`;

const Title = styled.h1`
  margin-bottom: 20px;
  max-width: 100%;
  width: 100%;
  padding-right: 20px;
  margin-top: 0;
  @media (max-width: ${(props) => props.theme.breakPoint.sm}) {
    padding: 0;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledButton = styled(Button).attrs({
  variant: 'outlined',
  type: 'button',
})`
  margin-left: 10px;
`;

const CreatedTime = styled.div`
  text-align: left;
  font-size: 14px;
  align-self: center;
  display: flex;
  flex-direction: column;
  height: 51px;
  justify-content: space-between;
`;

const TagsWrap = styled.div`
  margin: ${(props) => props.theme.spacing(2)}px 0;
`;

const TagStyled = styled(Chip)`
  font-weight: bold;
  font-size: 12px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const FormControlLabelStyled = styled(FormControlLabel)`
  & > * {
    font-size: 14px;
  }
`;

const ArticleDetailContainer: React.FC = () => {
  const dispatch = useDispatch();
  const article = useSelector(selectFirestoreArticle);
  const userInfo = useSelector(selectFirestoreUserInfo);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isActiveArticle, setIsActiveArticle] = useState(!!article?.isActive);

  const [_, searchTagBloc] = useBloc<SearchTagState, SearchTagBloc>(
    SearchTagBlocContext,
  );

  const isAuthActive = (() => {
    if (userInfo && article) {
      return article.uid === userInfo.uid;
    }
    return false;
  })();

  useEffect(() => {
    searchTagBloc.reset();
    if (article) {
      dispatch(updateArticleViewCountThunk(article));
      const MAX_STORED_COUNT = 5;
      const { title, slug, username: owner } = article;
      const nxvLocalStorage = NxvLocalStorage.of(localStorage);
      const storedHistoryList = nxvLocalStorage.getItem<
        ReadingHistoryListItemProps[]
      >('nxv/reading-history');

      const historyData: ReadingHistoryListItemProps = {
        title,
        owner,
        slug,
        timestamp: moment().format(),
      };

      if (storedHistoryList && storedHistoryList.length > 0) {
        const keyMappedHistoryDict = _keyBy(storedHistoryList, (history) => {
          return `${history.owner}/${history.slug}`;
        });

        const targetHistory = _get(
          keyMappedHistoryDict,
          `${owner}/${slug}`,
          undefined,
        );

        const historyValeus = _values(keyMappedHistoryDict);

        if (targetHistory) {
          const filteredHistories = historyValeus.filter((history) => {
            return `${history.owner}/${history.slug}` !== `${owner}/${slug}`;
          });

          const modifiedHistory = {
            ...targetHistory,
            timestamp: moment().format(),
          };

          const updatedHistories = [modifiedHistory, ...filteredHistories];
          nxvLocalStorage.setItem(
            'nxv/reading-history',
            updatedHistories.slice(0, MAX_STORED_COUNT),
          );
        } else {
          const rearrangedHistories = [historyData, ...historyValeus];
          nxvLocalStorage.setItem(
            'nxv/reading-history',
            rearrangedHistories.slice(0, MAX_STORED_COUNT),
          );
        }
      } else {
        nxvLocalStorage.setItem('nxv/reading-history', [historyData]);
      }
    }
  }, []);

  const onClickModify = () => {
    if (userInfo && article) {
      router.push(`/edit?owner=${userInfo.username}&slug=${article.slug}`);
    }
  };

  const onClickConfirm = () => {
    if (article) {
      dispatch(
        deleteFirestoreArticleThunk({
          username: article.username,
          slug: article.slug,
        }),
      );
    }
  };

  const onClickClapButton = () => {
    if (article) {
      dispatch(updateArticleClapCountThunk(article));
    }
  };

  const onClickTag = (tag: string) => {
    if (isLoggedIn) {
      router.push(`/?searchTag=${tag}`);
    } else {
      dispatch(
        showMessage({
          messageCode: 'message.login.need',
          severity: 'warning',
        }),
      );
    }
  };

  const onCheckArticleActiveToggle = (e: ChangeEvent<HTMLInputElement>) => {
    if (article) {
      setIsActiveArticle(e.target.checked);
      dispatch(updateArticleActiveThunk(e.target.checked, article));
    }
  };

  return (
    <>
      {article ? (
        <ArticleDetailContainerWrap>
          <Title>{article.title}</Title>
          <TagsWrap>
            {article.tags.map((tag) => (
              <TagStyled
                key={tag}
                label={`#${tag}`}
                onClick={() => onClickTag(tag)}
              />
            ))}
          </TagsWrap>
          <DescWrap>
            <CreatedTime>
              {moment(article.created).format('LL')}
              <Divider />
              <span>조회 {article.viewCount}</span>
            </CreatedTime>
            {isAuthActive && (
              <ButtonWrap>
                <StyledButton
                  startIcon={<CreateIcon />}
                  onClick={onClickModify}
                >
                  수정
                </StyledButton>
                <ButtonWithConfirmComponent
                  buttonText="삭제"
                  confirmButtonText="확인"
                  cancelButtonText="취소"
                  confirmMessage="정말 삭제하시겠습니까? 😨"
                  startIcon={<DeleteIcon />}
                  style={{ marginLeft: '10px' }}
                  onClickConfirm={onClickConfirm}
                />
              </ButtonWrap>
            )}
          </DescWrap>
          {isAuthActive && (
            <Box display="flex" justifyContent="flex-end">
              <FormControlLabelStyled
                control={
                  <Switch
                    onChange={onCheckArticleActiveToggle}
                    checked={isActiveArticle}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                }
                label="글 공개"
              />
            </Box>
          )}
          <ArticleDetailComponent rawMarkdownStr={article.content} />
          <FavoriteButtonComponent
            count={article.claps}
            onClick={onClickClapButton}
          />
        </ArticleDetailContainerWrap>
      ) : (
        <ErrorComponent />
      )}
    </>
  );
};

export default memo(ArticleDetailContainer);
