import React from 'react';
import styled from 'styled-components';

import _toString from 'lodash/toString';
import _toNumber from 'lodash/toNumber';
import _isUndefined from 'lodash/isUndefined';

interface AbbreviateNumberProps {
  value: number | string | undefined;
}

const AbbreviateNumberComponent: React.FC<AbbreviateNumberProps> = ({
  value,
}) => {
  const formattedNumberString = (() => {
    if (_isUndefined(value)) return '0';
    if (_toNumber(value) > 999) {
      return '999+';
    }
    return _toString(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  })();
  return <span>{formattedNumberString}</span>;
};

export default AbbreviateNumberComponent;
