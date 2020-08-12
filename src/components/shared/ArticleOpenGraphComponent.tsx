import React from 'react';
import Head from 'next/head';
import { FirestoreArticle } from '@models/firebase';

interface Props {
  article: FirestoreArticle;
}

const ArticleOpenGraph: React.FC<Props> = ({ article }) => {
  const ogTitle = article ? article.title : '넥시빌 아카이브 랩스';
  const ogDesc = article
    ? `[${article?.title}] ${article?.summary}`
    : `넥시빌 아카이브 랩스`;
  const ogUrl = `${process.env.NXV_ENV.BASE_DOMAIN}/@${article?.username}/${article?.slug}`;
  const ogImage = article
    ? article.previewImage
    : `https://firebasestorage.googleapis.com/v0/b/nxv-wiki-web-front-c3070.appspot.com/o/images%2Fshared%2Fbridge.png?alt=media&token=e5dd5f7c-3ff3-4d0b-afa2-466332e81a20`;
  const ogAlt = article ? article.title : 'Nexivil Archive Labs';
  return (
    <Head>
      <title>{ogTitle}</title>
      <meta name="description" content={ogDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogAlt} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="800" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:locale" content="ko_KR" />
      {/* <meta property="fb:app_id" content={FACEBOOK_APP_ID} /> */}
    </Head>
  );
};

export default ArticleOpenGraph;
