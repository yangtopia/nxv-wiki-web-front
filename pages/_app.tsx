import React from 'react';
import NextApp, { AppContext } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { LocalizeProvider } from 'react-localize-redux';
import ReactDOMServer from 'react-dom/server';
import { ConnectedRouter } from 'connected-next-router';

import firebase from '@services/initFirebase';

import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import configureStore from '@store/configureStore';
import {
  firebaseEmailLinkLoginThunk,
  setFirestoreUserInfoThunk,
} from '@store/auth';

import translations from '@public/translation.json';

import { nxvTheme } from '@styles/theme';
import '@styles/global.scss';

import 'moment/locale/ko';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

class MyApp extends NextApp<ReduxWrapperAppProps> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const { store } = this.props;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) store.dispatch<any>(setFirestoreUserInfoThunk(user));
    });

    store.dispatch<any>(firebaseEmailLinkLoginThunk(window.location.href));
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <>
        <Head>
          <title>넥시빌 아카이브 랩스</title>
          <meta
            name="keywords"
            content="nexivil, 넥시빌, archive, 아카이브, labs, 랩스"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes, maximum-scale=1"
          />
          <meta
            name="description"
            content="넥시빌 건설전문가의 지식을 수식, 이미지, 그래프를 지원하는 풍부한 마크다운 언어로 공유합니다."
          />
          <link
            rel="search"
            type="application/opensearchdescription+xml"
            title="넥시빌 아카이브 랩스"
            href="/opensearch.xml"
          />
          <meta
            name="google-site-verification"
            content="zpMVqTphuABc985dWZIkE9lpOkEfCb41JiinqaG5au0"
          />
          <meta
            name="naver-site-verification"
            content="9b09e01c3a687621235b670e55419949ea0bef2a"
          />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link
            rel="preload"
            as="stylesheet"
            href="//fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
          />
        </Head>
        <LocalizeProvider
          initialize={{
            languages: [
              { name: '한국어', code: 'ko' },
              { name: 'English', code: 'en' },
            ],
            translation: translations,
            options: {
              defaultLanguage: 'ko',
              renderToStaticMarkup: ReactDOMServer.renderToStaticMarkup,
            },
          }}
        >
          <StylesProvider injectFirst>
            <StyledThemeProvider theme={nxvTheme}>
              <MuiThemeProvider theme={nxvTheme}>
                <CssBaseline />
                <Provider store={store}>
                  <ConnectedRouter>
                    <Component {...pageProps} />
                  </ConnectedRouter>
                </Provider>
              </MuiThemeProvider>
            </StyledThemeProvider>
          </StylesProvider>
        </LocalizeProvider>
      </>
    );
  }
}

export default withRedux(configureStore)(MyApp);
