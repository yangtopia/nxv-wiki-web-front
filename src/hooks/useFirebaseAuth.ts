import { useEffect, useState } from 'react';
import firebase from '@services/initFirebase';
import _get from 'lodash/get';
import _has from 'lodash/has';

export const useFirebaseAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser;
    return {
      isInitializing: !user,
      user,
    };
  });

  function onChange(user: firebase.User | null) {
    setState({ isInitializing: false, user });
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    return () => unsubscribe();
  }, []);

  return state;
};
