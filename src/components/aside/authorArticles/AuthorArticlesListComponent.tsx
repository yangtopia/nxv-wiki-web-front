import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { FirestoreArticle } from '@models/firebase';
import AuthorArticlesListItemComponent from './AuthorArticleListItemComponent';

const AsideSectionWrap = styled.section`
  margin-bottom: 100px;
  max-width: 240px;
`;

const Heading = styled.h3`
  padding-bottom: 10px;
  margin-top: 0px;
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: 1px solid rgb(233, 236, 239);
`;

const UlStyled = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  position: relative;
`;

interface Props {
  authorArticles: FirestoreArticle[];
}

const AuthorArticlesListComponent: React.FC<Props> = ({ authorArticles }) => {
  return (
    <AsideSectionWrap>
      <Heading>
        <Translate id="common.author-articles" />
      </Heading>
      <section>
        <UlStyled>
          {authorArticles.map((article) => (
            <ListItem key={`${article.username}/${article.slug}`}>
              <AuthorArticlesListItemComponent {...article} />
            </ListItem>
          ))}
        </UlStyled>
      </section>
    </AsideSectionWrap>
  );
};

export default AuthorArticlesListComponent;
