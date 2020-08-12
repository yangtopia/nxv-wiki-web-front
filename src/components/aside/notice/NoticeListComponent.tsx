import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import NoticeListItemComponent, {
  NoticeListItemProps,
} from './NoticeListItemComponent';

const AsideSectionWrap = styled.section`
  margin-bottom: 100px;
`;

const NoticeHeading = styled.h4`
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

interface NoticeListProps {
  noticeList: NoticeListItemProps[];
}

const NoticeListComponent: React.FC<NoticeListProps> = ({ noticeList }) => (
  <AsideSectionWrap>
    <NoticeHeading>
      <Translate id="common.notice" />
    </NoticeHeading>
    <section>
      <UlStyled>
        {noticeList.map((notice) => (
          <li key={notice.title}>
            <NoticeListItemComponent {...notice} />
          </li>
        ))}
      </UlStyled>
    </section>
  </AsideSectionWrap>
);

export default NoticeListComponent;
