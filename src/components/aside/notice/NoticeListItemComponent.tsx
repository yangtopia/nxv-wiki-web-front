import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import moment from 'moment';

const NoticeTitle = styled.h3`
  margin: 0;
`;

const ALink = styled.a`
  color: rgb(73, 80, 87);
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export interface NoticeListItemProps {
  owner: string;
  title: string;
  slug: string;
  modified: string;
}

const NoticeListItemComponent: React.FC<NoticeListItemProps> = ({
  owner,
  title,
  slug,
  modified,
}) => {
  const attachedAuthorPrefix = `@${owner}`;
  return (
    <>
      <NoticeTitle>
        <Link href="/[owner]/[slug]" as={`/${attachedAuthorPrefix}/${slug}`}>
          <ALink>{title}</ALink>
        </Link>
      </NoticeTitle>
      <Translate>
        {() => <p>{moment(modified, 'YYYY-MM-DD').fromNow()}</p>}
      </Translate>
    </>
  );
};

export default NoticeListItemComponent;
