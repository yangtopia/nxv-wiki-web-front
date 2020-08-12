import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import ReadingHistoryListItemComponent, {
  ReadingHistoryListItemProps,
} from './ReadingHistoryListItemComponent';

const AsideSectionWrap = styled.section`
  margin-bottom: 100px;
  max-width: 240px;
`;

const NoticeHeading = styled.h3`
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

interface ReadingHistoryList {
  historyList: ReadingHistoryListItemProps[];
}

const ReadingHistoryListComponent: React.FC<ReadingHistoryList> = ({
  historyList,
}) => (
  <AsideSectionWrap>
    <NoticeHeading>
      <Translate id="common.read-history" />
    </NoticeHeading>
    <section>
      <UlStyled>
        {historyList.map((readingHistory, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={idx}>
            <ReadingHistoryListItemComponent {...readingHistory} />
          </li>
        ))}
      </UlStyled>
    </section>
  </AsideSectionWrap>
);

export default ReadingHistoryListComponent;
