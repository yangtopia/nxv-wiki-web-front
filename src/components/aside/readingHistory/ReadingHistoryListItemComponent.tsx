import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import moment from 'moment';
import { TextOverflowEllipsis } from '@styles/styled-mixins';

const HistoryTitle = styled.h4`
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

export interface ReadingHistoryListItemProps {
  slug: string;
  owner: string;
  title: string;
  modified?: string;
  timestamp: string;
}

const ReadingHistoryListItemComponent: React.FC<ReadingHistoryListItemProps> = ({
  owner,
  title,
  slug,
  timestamp,
}) => {
  return (
    <>
      <HistoryTitle>
        <Link href="/[owner]/[slug]" as={`/@${owner}/${slug}`}>
          <ALink>{title}</ALink>
        </Link>
      </HistoryTitle>
      <Translate>
        {() => <Timestamp>{moment(timestamp).fromNow()}</Timestamp>}
      </Translate>
    </>
  );
};

export default ReadingHistoryListItemComponent;
