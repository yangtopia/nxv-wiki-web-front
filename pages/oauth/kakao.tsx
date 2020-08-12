import React from 'react';
import { NextPage } from 'next';
import initAxios from 'axios';
import queryString from 'query-string';
import dynamic from 'next/dynamic';
import firebase from '@services/initFirebase';

import { LayoutContainer } from '@containers/index';
import { KakaoAccountResponse, KakaoAuthTokenResponse } from '@models/kakao';

const LoadingComponent = dynamic(
  () => import('@components/shared/LoadingComponent'),
  {
    ssr: false,
  },
);

interface PageProps {
  firebaseToken?: string;
}

const axios = initAxios.create();

const OAuthKakaoPage: NextPage<PageProps> = ({ firebaseToken }) => {
  if (firebaseToken) {
    firebase.auth().signInWithCustomToken(firebaseToken);
  }
  return (
    <LayoutContainer isShowAsideContainer={false}>
      <LoadingComponent />
    </LayoutContainer>
  );
};

OAuthKakaoPage.getInitialProps = async ({ query, isServer }) => {
  if (isServer) {
    try {
      const { code: kakaoCode } = query;
      const kakaoAuthRequestParams = {
        grant_type: 'authorization_code',
        client_id: process.env.NXV_ENV.KAKAO_REST_API_KEY,
        redirect_uri: `${process.env.NXV_ENV.BASE_DOMAIN}/oauth/kakao`,
        code: kakaoCode,
      };
      const {
        data: { access_token: kakaoAccessToken },
      } = await axios.post<KakaoAuthTokenResponse>(
        '/oauth/token',
        queryString.stringify(kakaoAuthRequestParams),
        {
          baseURL: 'https://kauth.kakao.com',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      const {
        data: { id, kakao_account, properties },
      } = await axios.get<KakaoAccountResponse>(
        '/v2/user/me?secure_resource=true',
        {
          baseURL: 'https://kapi.kakao.com',
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      const { data: firebaseToken } = await axios.post(
        `${process.env.NXV_ENV.FIREBASE_CLOUD_FUNCTION_DOMAIN}/getCustomToken`,
        {
          userId: `kakao:${id}`,
          photoURL: properties.profile_image,
          email: kakao_account.email,
          displayName: properties.nickname,
        },
      );
      return firebaseToken;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  return undefined;
};

export default OAuthKakaoPage;
