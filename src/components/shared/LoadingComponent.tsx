import React, { useEffect } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { ReactSVG } from 'react-svg';
import { Translate } from 'react-localize-redux';
import _delay from 'lodash/delay';

import firebase from '@services/initFirebase';
import { useFirebaseAuth } from '@hooks/useFirebaseAuth';
import { useDispatch } from 'react-redux';
import { setFirestoreUserInfoThunk } from '@store/auth';

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const InnerWrap = styled.div`
  margin: 0 auto;
  text-align: center;
  font-size: 20px;
`;

const SVGLoading = styled(ReactSVG).attrs({
  src: '/svgs/loading.svg',
})`
  & > div {
    svg {
      width: 300px;
      height: 300px;
    }
  }
`;

const LoadingComponent: React.FC = () => {
  const { user } = useFirebaseAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setFirestoreUserInfoThunk(user));
      _delay(() => router.replace('/'), 1000);
    }
  }, [user]);

  return (
    <Wrap>
      <InnerWrap>
        <SVGLoading />
        <Translate id="common.loading" />
      </InnerWrap>
    </Wrap>
  );
};

export default LoadingComponent;
