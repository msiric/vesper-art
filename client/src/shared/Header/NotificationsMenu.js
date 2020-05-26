import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Menu, List, Divider } from '@material-ui/core';
import NotificationItem from './NotificationItem';
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

const NotificationsMenu = ({
  notifications,
  handleNotificationsMenuClose,
  handleReadClick,
  handleUnreadClick,
}) => {
  const classes = NotificationsMenuStyles();

  return (
    <StyledMenu
      anchorEl={notifications.anchorEl}
      keepMounted
      open={Boolean(notifications.anchorEl)}
      onClose={handleNotificationsMenuClose}
    >
      {notifications.loading ? (
        'Loading'
      ) : (
        <List className={classes.root}>
          {notifications.data && notifications.data.length
            ? notifications.data.map((notification, index) => (
                <>
                  {index === 0 ? <Divider /> : null}
                  <NotificationItem
                    notification={notification}
                    handleReadClick={handleReadClick}
                    handleUnreadClick={handleUnreadClick}
                  />
                </>
              ))
            : 'No notifications'}
        </List>
      )}
    </StyledMenu>
  );
};

export default NotificationsMenu;
