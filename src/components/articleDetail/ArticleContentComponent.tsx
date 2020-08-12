import React, { memo } from 'react';
import styled from 'styled-components';
import { Paper } from '@material-ui/core';

import {
  ArticleLayoutResponsiveWidth,
  MarkdownStyle,
} from '@styles/styled-mixins';
import markdownParser from '@utils/nxv-markdown-parser';
import useApexRender from '@hooks/useApexRender';

const ArticleContent = styled(Paper).attrs({
  elevation: 0,
})`
  font-size: 16px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 30px;
  ${ArticleLayoutResponsiveWidth}
  ${MarkdownStyle}
`;

interface ArticleContentProps {
  rawMarkdownStr: string;
}

const ArticleContentComponent: React.FC<ArticleContentProps> = ({
  rawMarkdownStr,
}) => {
  useApexRender([rawMarkdownStr]);

  return (
    <>
      <ArticleContent
        dangerouslySetInnerHTML={{ __html: markdownParser(rawMarkdownStr) }}
      />
    </>
  );
};

export default memo(ArticleContentComponent);
