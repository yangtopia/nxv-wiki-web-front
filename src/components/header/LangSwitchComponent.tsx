import React, { useEffect } from 'react';
import { LocalizeContextProps, withLocalize } from 'react-localize-redux';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import _find from 'lodash/find';
import _get from 'lodash/get';

import moment from 'moment';

import { Button } from '@material-ui/core';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';

import { NxvLocalStorage } from '@utils/nxv-local-storage';

import { showMessage } from '@store/message';

type Props = LocalizeContextProps;

const StyledButton = styled(Button).attrs({
  variant: 'outlined',
  type: 'button',
})``;

const LanguageIcon = styled(LanguageOutlinedIcon)``;

const LangSwitchComponent: React.FC<Props> = ({
  languages,
  activeLanguage,
  setActiveLanguage,
}) => {
  const dispatch = useDispatch();
  const unSelectedLanguageCode = _get(
    _find(languages, (language) => {
      return language.code !== activeLanguage.code;
    }),
    'code',
    'ko',
  );

  useEffect(() => {
    const storedLanguageCode =
      NxvLocalStorage.of(localStorage).getItem('nxv/lang') || 'ko';
    if (storedLanguageCode !== activeLanguage.code) {
      changLanguageHandler(unSelectedLanguageCode);
    }
  }, []);

  const onClickHandler = () => {
    NxvLocalStorage.of(localStorage).setItem(
      'nxv/lang',
      unSelectedLanguageCode,
    );
    changLanguageHandler(unSelectedLanguageCode);
    dispatch(
      showMessage({
        messageCode: 'message.language.changed',
        severity: 'success',
      }),
    );
  };

  const changLanguageHandler = (languageCode: string) => {
    moment.locale(languageCode);
    setActiveLanguage(languageCode);
  };

  return (
    <StyledButton startIcon={<LanguageIcon />} onClick={onClickHandler}>
      {activeLanguage.name}
    </StyledButton>
  );
};

export default withLocalize(LangSwitchComponent);
