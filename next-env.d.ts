/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.md' {
  const value: string;
  export default value;
}
declare module 'markdown-it-*';

declare var Kakao: any;

declare namespace NodeJS {
  interface ProcessEnv {
    NXV_ENV: {
      APP_VERSION: string;
      BASE_DOMAIN: string;
      API_BASE_URL: string;
      CRYPTO_KEY: string;
      FIREBASE_API_KEY: string;
      FIREBASE_AUTH_DOMAIN: string;
      FIREBASE_DATABASE_URL: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_STORAGE_BUCKET: string;
      FIREBASE_MESSAGING_SENDER_ID: string;
      FIREBASE_APP_ID: string;
      FIREBASE_MEASUREMENT_ID: string;
      FIREBASE_CLOUD_FUNCTION_DOMAIN: string;
      FIREBASE_ARTICLE_COLLECTION_NAME: string;
      KAKAO_NATIVE_APP_KEY: string;
      KAKAO_REST_API_KEY: string;
      KAKAO_JAVASCRIPT_KEY: string;
      KAKAO_ADMIN_KEY: string;
    };
  }
}
