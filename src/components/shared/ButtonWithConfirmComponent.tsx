import React from 'react';

import { Button } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import withConfirm, { WithConfirmProps } from './hoc/withConfirm';

interface Props extends WithConfirmProps {
  buttonText: string;
  variant?: 'text' | 'outlined' | 'contained';
  startIcon?: React.ReactNode;
  style?: CSSProperties;
}

const ButtonWithConfirmComponent: React.FC<Props> = ({
  buttonText,
  variant = 'outlined',
  startIcon,
  style,
  onOpen,
}) => {
  return (
    <Button
      type="button"
      variant={variant}
      onClick={onOpen}
      startIcon={startIcon}
      style={style}
    >
      {buttonText}
    </Button>
  );
};

export default withConfirm(ButtonWithConfirmComponent);
