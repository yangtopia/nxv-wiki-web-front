import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@material-ui/core';
import { FirestoreArticle } from '@models/firebase';
import {
  fetchFirestoreAuthorArticleListThunk,
  selectAuthorArticleList,
} from '@store/articleList';
import { selectFirestoreUserInfo } from '@store/auth';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const MyInfoContainerWrap = styled.div`
  position: relative;
  width: 100%;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    padding: 0 ${(props) => props.theme.spacing(2)}px;
  }
`;

const CardStyled = styled(Card)`
  display: flex;
  margin: 20px 0;
`;

const CardContentWrapStyled = styled.div`
  display: flex;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    flex-direction: column;
  }
`;

const CardMediaStyled = styled(CardMedia)`
  height: 200px;
  width: 300px;
  @media (max-width: ${(props) => props.theme.breakPoint.md}) {
    width: 100%;
  }
`;

const CardContentStyled = styled(CardContent)`
  width: 80%;
`;

const Updated = styled.div`
  text-overflow: ellipsis;
`;

const MyInfoContainer: React.FC = () => {
  const dispatch = useDispatch();
  const authorArticles = useSelector(selectAuthorArticleList);
  const auth = useSelector(selectFirestoreUserInfo);
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      dispatch(fetchFirestoreAuthorArticleListThunk(auth.uid));
    }
  }, [auth]);

  const onClickCard = (article: FirestoreArticle) => {
    const url = `/@${article.username}/${article.slug}`;
    router.push('/[owner]/[slug]', url);
  };

  return (
    <MyInfoContainerWrap>
      <section>
        <h1># 내글 목록</h1>
        {authorArticles.map((article) => (
          <CardStyled
            key={article.title}
            elevation={2}
            onClick={() => onClickCard(article)}
          >
            <CardActionArea>
              <CardContentWrapStyled>
                <CardMediaStyled
                  src="image"
                  image={article.previewImage || '/images/empty.png'}
                />
                <CardContentStyled>
                  <h2>{article.title}</h2>
                  <Updated>{moment(article.updated).format('LLLL')}</Updated>
                </CardContentStyled>
              </CardContentWrapStyled>
            </CardActionArea>
          </CardStyled>
        ))}
      </section>
    </MyInfoContainerWrap>
  );
};

export default MyInfoContainer;
