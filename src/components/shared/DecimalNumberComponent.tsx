import React from 'react';
import styled from 'styled-components';

import _toString from 'lodash/toString';
import _isUndefined from 'lodash/isUndefined';

interface DecimalNumberProps {
  value: number | string | undefined;
}

const DecimalNumberComponent: React.FC<DecimalNumberProps> = ({ value }) => {
  const formattedNumberString = _isUndefined(value)
    ? '0'
    : _toString(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return <span>{formattedNumberString}</span>;
};

export default DecimalNumberComponent;
