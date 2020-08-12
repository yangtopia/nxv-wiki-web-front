import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import moment from 'moment';
import { FirestoreArticle } from '@models/firebase';
import { TextOverflowEllipsis } from '@styles/styled-mixins';

const ArticleTitle = styled.h4`
  margin: 0;
`;

const ALink = styled.div`
  width: 100%;
  color: rgb(73, 80, 87);
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  ${TextOverflowEllipsis};
`;

const Timestamp = styled.p`
  font-size: 10px;
`;

const AuthorArticlesListItemComponent: React.FC<FirestoreArticle> = ({
  title,
  slug,
  username,
  created,
}) => {
  return (
    <>
      <ArticleTitle>
        <Link href="/[owner]/[slug]" as={`/@${username}/${slug}`}>
          <ALink>{title}</ALink>
        </Link>
      </ArticleTitle>
      <Translate>
        {() => <Timestamp>{moment(created).fromNow()}</Timestamp>}
      </Translate>
    </>
  );
};

export default AuthorArticlesListItemComponent;
