import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import { Button, makeStyles, Theme, createStyles } from '@material-ui/core';

const ButtonGroupWrap = styled.div`
  padding: 20px 0 20px 20px;
  text-align: right;
`;

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    button: {
      marginLeft: 20,
    },
  }),
);

interface EditorButtonGroupProps {
  onClickSave: () => void;
  onClickPublish: () => void;
}

const EditorButtonGroupComponent: React.FC<EditorButtonGroupProps> = ({
  onClickSave,
  onClickPublish,
}) => {
  const classes = useStyles();
  return (
    <ButtonGroupWrap>
      <Button
        className={classes.button}
        variant="contained"
        size="large"
        onClick={onClickSave}
      >
        <Translate id="common.save" />
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
        onClick={onClickPublish}
      >
        <Translate id="common.publish" />
      </Button>
    </ButtonGroupWrap>
  );
};

export default EditorButtonGroupComponent;
