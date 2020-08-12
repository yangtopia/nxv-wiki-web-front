import * as firebase from 'firebase';

export const ARTICLE_TEMP_COLLECTION_NAME = 'article-temp';
export const ARTICLE_COLLECTION_NAME =
  process.env.NXV_ENV.FIREBASE_ARTICLE_COLLECTION_NAME;
export const ARTICLE_TAG_COLLECTION_NAME = 'tags';

function initFirebase() {
  if (firebase.apps.length) {
    return firebase;
  }

  firebase.initializeApp({
    apiKey: process.env.NXV_ENV.FIREBASE_API_KEY,
    authDomain: process.env.NXV_ENV.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NXV_ENV.FIREBASE_DATABASE_URL,
    projectId: process.env.NXV_ENV.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NXV_ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NXV_ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NXV_ENV.FIREBASE_APP_ID,
    measurementId: process.env.NXV_ENV.FIREBASE_MEASUREMENT_ID,
  });

  return firebase;
}

export default initFirebase();
