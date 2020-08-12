import React, { useState } from 'react';
import router from 'next/router';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@material-ui/core';

import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  ExitToApp as ExitToAppIcon,
  PermIdentity as PermIdentityIcon,
} from '@material-ui/icons';
import { selectFirestoreUserInfo, firebaseLogoutThunk } from '@store/auth';
import { showUsernameModal } from '@store/modal';
import { FirestoreUserInfo } from '@models/firebase';

const Wrap = styled.div`
  display: flex;
  align-items: center;
`;

const UserEmail = styled.span`
  font-size: 14px;
  @media (max-width: ${(props) => props.theme.breakPoint.sm}) {
    font-size: 12px;
  }
`;

const StyledListItemText = styled(ListItemText)`
  & > * {
    font-size: 14px;
  }
`;

const AvatarStyled = styled(Avatar).attrs({
  alt: 'profile-photo',
})`
  width: 35px;
  height: 35px;
`;

const MenuComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userInfo = useSelector(selectFirestoreUserInfo) as FirestoreUserInfo;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWrite = () => {
    setAnchorEl(null);
    if (_isEmpty(userInfo.username)) {
      dispatch(showUsernameModal());
    } else {
      router.push('/write');
    }
  };

  const handleMyArticles = () => {
    setAnchorEl(null);
    router.push('/myinfo');
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    dispatch(firebaseLogoutThunk());
    router.replace('/');
  };

  return (
    <Wrap>
      <UserEmail>{userInfo?.email}</UserEmail>
      <IconButton
        aria-label="more"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {userInfo?.photoURL ? (
          <AvatarStyled src={userInfo?.photoURL} />
        ) : (
          <AccountCircleIcon style={{ fontSize: 35 }} />
        )}
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleWrite}>
          <ListItemIcon>
            <CreateIcon fontSize="default" />
          </ListItemIcon>
          <StyledListItemText>
            <Translate id="common.write" />
          </StyledListItemText>
        </MenuItem>
        <MenuItem onClick={handleMyArticles}>
          <ListItemIcon>
            <PermIdentityIcon fontSize="default" />
          </ListItemIcon>
          <StyledListItemText>
            <Translate id="common.my-info" />
          </StyledListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="default" />
          </ListItemIcon>
          <StyledListItemText>
            <Translate id="common.logout" />
          </StyledListItemText>
        </MenuItem>
      </Menu>
    </Wrap>
  );
};

export default MenuComponent;
