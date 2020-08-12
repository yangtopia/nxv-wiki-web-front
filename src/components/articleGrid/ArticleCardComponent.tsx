import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Translate } from 'react-localize-redux';

import _capitalize from 'lodash/capitalize';
import _isEmpty from 'lodash/isEmpty';

import moment from 'moment';

import {
  Avatar,
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  Chip,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { Favorite as FavoriteIcon } from '@material-ui/icons';

import { FlexSpaceBetween } from '@styles/styled-mixins';

import { AbbreviateNumberComponent } from '@components/shared';

import { FirestoreArticle } from '@models/firebase';
import { useBloc } from '@hooks/useBloc';
import {
  SearchTagBlocContext,
  SearchTagState,
  SearchTagBloc,
} from '@blocs/searchTag';
import { fetchFirestoreArticleListThunk } from '@store/articleList';
import { selectIsLoggedIn } from '@store/auth';
import { showMessage } from '@store/message';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('md')]: {
        height: 450,
        maxWidth: 300,
      },
      boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    },
    cardAction: {
      height: '84%',
    },
    cardContent: {
      minHeight: '145px',
      [theme.breakpoints.up('md')]: {
        paddingTop: 10,
      },
    },
    avatar: {
      backgroundColor: theme.palette.primary.dark,
      fontWeight: 'bold',
    },
    header: {
      // paddingTop: '1rem',
      // paddingBottom: '1rem',
    },
    headerTypography: {
      fontSize: '15px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '170px',
      overflow: 'hidden',
    },
  }),
);

const ArticleTitle = styled.h4`
  font-size: 18px;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  color: rgb(33, 37, 41);
  margin: 0px 0px 10px;
`;

const ArticleDescription = styled.p<{ isPreviewImageExist: boolean }>`
  word-break: break-all;
  overflow-wrap: break-word;
  font-size: 12px;
  line-height: 1.5;
  color: rgb(73, 80, 87);
  margin: 0px 0px 15px;
  max-height: ${(props) => (props.isPreviewImageExist ? '50px' : '220px')};
  min-height: ${(props) => (props.isPreviewImageExist ? 'auto' : '180px')};
  overflow: hidden;
`;

const ArticleSubInfo = styled.div`
  ${FlexSpaceBetween}
  font-size: 12px;
  line-height: 1.5;
  justify-content: flex-end;
`;

interface CardImageWrapProps {
  isShow: boolean;
}

const CardImageWrap = styled.div<CardImageWrapProps>`
  display: ${({ isShow }) => (isShow ? 'block' : 'none')};
  width: 100%;
  height: 200px;
  max-height: 200px;
  overflow: hidden;
`;

const LazyLoadImageStyled = styled(LazyLoadImage)`
  width: 100%;
`;

const CardHeaderWrap = styled.div`
  ${FlexSpaceBetween};
  padding-right: 16px;
`;

const FavoriteWrap = styled.div`
  ${FlexSpaceBetween};
`;

const FavoriteCount = styled.span`
  font-size: 12px;
  margin-left: 6px;
`;

const TagWrap = styled.div`
  padding-top: ${(props) => props.theme.spacing(1)}px;
  padding-left: ${(props) => props.theme.spacing(2)}px;
  padding-right: ${(props) => props.theme.spacing(2)}px;
`;

const TagStyled = styled(Chip)`
  font-weight: bold;
  font-size: 12px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

interface Props {
  article: FirestoreArticle;
}

const ArticleCardComponent: React.FC<Props> = ({ article }) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [{ searchTag }, searchTagBloc] = useBloc<SearchTagState, SearchTagBloc>(
    SearchTagBlocContext,
  );

  const {
    title,
    username,
    previewImage,
    summary,
    slug,
    tags,
    avatarImageUrl,
    claps,
    created,
  } = article;

  const alterAvatarImageStr = _capitalize(username.slice(0, 1));

  const modifiedContentStr = (() => {
    const contentLength = _isEmpty(previewImage) ? 370 : 80;
    const modifiedText = summary.substr(0, contentLength).trim();
    return `${modifiedText}...`;
  })();

  const handleRouting = () => {
    const attachedAuthorPrefix = `@${username}`;
    router.push('/[owner]/[slug]', `/${attachedAuthorPrefix}/${slug}`);
  };

  const onClickTag = (tag: string) => {
    if (isLoggedIn) {
      searchTagBloc.setTag(tag);
      searchTagBloc.setIsSearching(true);
      dispatch(
        fetchFirestoreArticleListThunk({
          isReset: true,
          searchTag: tag,
        }),
      );
      router.push(`/?search=${tag}`);
    } else {
      dispatch(
        showMessage({
          messageCode: 'message.login.need',
          severity: 'warning',
        }),
      );
    }
  };

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.cardAction} onClick={handleRouting}>
        <CardImageWrap isShow={!!previewImage}>
          <LazyLoadImageStyled
            alt={title}
            effect="blur"
            width="100%"
            src={previewImage}
          />
        </CardImageWrap>
        <CardContent className={classes.cardContent}>
          <ArticleTitle>{title}</ArticleTitle>
          <ArticleDescription isPreviewImageExist={!!previewImage}>
            {modifiedContentStr}
          </ArticleDescription>
          <ArticleSubInfo>
            <Translate>
              {() => <span>{moment(created).format('LL')}</span>}
            </Translate>
          </ArticleSubInfo>
        </CardContent>
      </CardActionArea>
      <TagWrap>
        {tags.map((tag) => (
          <TagStyled
            key={tag}
            label={`#${tag}`}
            size="small"
            color={tag === searchTag ? 'primary' : 'default'}
            onClick={() => onClickTag(tag)}
          />
        ))}
      </TagWrap>
      <CardHeaderWrap>
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              alt={username}
              src={avatarImageUrl}
            >
              {alterAvatarImageStr}
            </Avatar>
          }
          title={username}
          titleTypographyProps={{
            className: classes.headerTypography,
          }}
        />
        <FavoriteWrap>
          <FavoriteIcon style={{ color: red[500] }} />
          <FavoriteCount>
            <AbbreviateNumberComponent value={claps} />
          </FavoriteCount>
        </FavoriteWrap>
      </CardHeaderWrap>
    </Card>
  );
};

export default ArticleCardComponent;
