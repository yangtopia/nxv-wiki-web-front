import React from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { Button, Theme, makeStyles, createStyles } from '@material-ui/core';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 70vh;
  p {
    font-size: 20px;
  }
`;

const SVG404 = styled(ReactSVG).attrs({
  src: '/svgs/404.svg',
})`
  width: 100%;
  & > div {
    display: flex;
    svg {
      margin: 0 auto;
      width: 300px;
      height: 200px;
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '14px',
      width: 10,
      textDecoration: 'none',
    },
  }),
);

interface Props {
  errorCode?: string;
}

const ErrorComponent: React.FC<Props> = ({ errorCode = 'pageNotFound' }) => {
  const classes = useStyles();

  const onClickHandler = () => {
    window.location.href = '/';
  };

  return (
    <Wrap>
      <SVG404 />
      <p>
        <Translate id={`error.${errorCode}`} />
      </p>
      <Button
        className={classes.root}
        variant="outlined"
        type="button"
        onClick={onClickHandler}
      >
        HOME
      </Button>
    </Wrap>
  );
};

export default ErrorComponent;
