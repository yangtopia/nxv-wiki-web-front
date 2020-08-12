/* eslint-disable no-console */
import * as functions from 'firebase-functions';
import * as firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert('./serviceAccountKey.json'),
  databaseURL: 'https://nxv-wiki-web-front-c3070.firebaseio.com',
});

export const getCustomToken = functions.https.onRequest(async (req, res) => {
  const { userId: uid, photoURL, email, displayName } = req.body as {
    [key: string]: string;
  };
  const userRecord = await firebaseAdmin
    .auth()
    .updateUser(uid, { displayName, photoURL, email })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        return firebaseAdmin.auth().createUser({
          uid,
          displayName,
          email,
          photoURL,
        });
      }
      throw error;
    });

  const docRef = await firebaseAdmin
    .firestore()
    .collection('users')
    .doc(userRecord.uid);

  if ((await docRef.get()).exists) {
    await docRef.update({
      photoURL,
      email,
      displayName,
    });
  } else {
    await docRef.create({
      uid,
      username: '',
      photoURL,
      email,
      displayName,
    });
  }

  const firebaseToken = await firebaseAdmin
    .auth()
    .createCustomToken(userRecord.uid, { provider: 'KAKAO' })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
  res.send({ firebaseToken });
});

export const createUserInfo = functions.auth
  .user()
  .onCreate(async (userRecord) => {
    const { uid, photoURL, email, displayName } = userRecord;
    const documentRef = await firebaseAdmin
      .firestore()
      .collection('users')
      .doc(userRecord.uid);

    const userInfo = {
      uid,
      username: '',
      photoURL,
      email,
      displayName,
    };

    if ((await documentRef.get()).exists) {
      const result = await documentRef.update(userInfo);
      console.log(`setUserInfo_update: ${result.writeTime}`);
    } else {
      const result = await documentRef.create(userInfo);
      console.log(`setUserInfo_create: ${result.writeTime}`);
    }
  });

export const deleteUserInfo = functions.auth
  .user()
  .onDelete(async (userRecord) => {
    const { uid } = userRecord;
    const result = await firebaseAdmin
      .firestore()
      .collection('users')
      .doc(uid)
      .delete();
    console.log(`deleteUserInfo: ${result.writeTime}`);
  });
