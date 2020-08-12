import React from 'react';
import { NextPage } from 'next';
import { LayoutContainer } from '@containers/index';
import ErrorComponent from '@components/shared/ErrorComponent';

interface PageProps {
  statusCode: number;
}

const ErrorPage: NextPage<PageProps> = ({ statusCode }) => {
  return (
    <LayoutContainer isShowAsideContainer={false}>
      <ErrorComponent />
    </LayoutContainer>
  );
};

ErrorPage.getInitialProps = async ({ res, err }): Promise<PageProps> => {
  const statusCode = (() => {
    if (res) {
      return res.statusCode;
    }
    return err?.statusCode || 404;
  })();

  return { statusCode };
};

export default ErrorPage;
