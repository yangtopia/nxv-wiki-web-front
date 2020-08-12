import React, { memo } from 'react';
import styled from 'styled-components';
import Fade from 'react-reveal';

import { Grid } from '@material-ui/core';

import { FirestoreArticle } from '@models/firebase';
import ArticleCardComponent from './ArticleCardComponent';

const Wrap = styled.div`
  flex-grow: 1;
`;

const StyledGrid = styled(Grid)`
  cursor: pointer;
`;

interface Props {
  articles: FirestoreArticle[];
}

const ArticleGridComponent: React.FC<Props> = ({ articles }) => {
  return (
    <Wrap>
      <Grid container spacing={3}>
        {articles.map((article) => (
          <StyledGrid
            key={`${article.uid}/${article.slug}`}
            item
            xs={12}
            sm={6}
            md={6}
            lg={4}
            xl={3}
          >
            <Fade>
              <ArticleCardComponent article={article} />
            </Fade>
          </StyledGrid>
        ))}
      </Grid>
    </Wrap>
  );
};

export default memo(ArticleGridComponent, (prev, curr) => {
  return prev.articles.length === curr.articles.length;
});
