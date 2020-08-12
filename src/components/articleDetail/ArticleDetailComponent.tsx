import React from 'react';
import dynamic from 'next/dynamic';

const NoSSRArticleContentComponent = dynamic(
  () => import('./ArticleContentComponent'),
  {
    ssr: false,
  },
);

interface ArticleDetailProps {
  rawMarkdownStr: string;
}

const ArticleDetailComponent: React.FC<ArticleDetailProps> = ({
  rawMarkdownStr,
}) => {
  return (
    <>
      <NoSSRArticleContentComponent rawMarkdownStr={rawMarkdownStr} />
    </>
  );
};

export default ArticleDetailComponent;
