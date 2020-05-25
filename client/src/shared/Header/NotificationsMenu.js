import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { NotificationsRounded as NotificationsIcon } from '@material-ui/icons';
import NotificationsMenuStyles from './NotificationsMenu.style';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const NotificationsMenu = ({ anchorEl, handleNotificationsMenuClose }) => {
  const classes = NotificationsMenuStyles();

  return (
    <StyledMenu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleNotificationsMenuClose}
    >
      <List className={classes.root}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NotificationsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Photos" secondary="Jan 9, 2014" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NotificationsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Work" secondary="Jan 7, 2014" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NotificationsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Vacation" secondary="July 20, 2014" />
        </ListItem>
      </List>
    </StyledMenu>
  );
};

export default NotificationsMenu;
