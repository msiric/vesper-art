import { Divider, Grid, List, Menu } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationItem from './NotificationItem.js';
import NotificationsMenuStyles from './NotificationsMenu.style.js';

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
  loadMore,
}) => {
  const classes = NotificationsMenuStyles();

  return (
    <StyledMenu
      anchorEl={notifications.anchor}
      keepMounted
      open={Boolean(notifications.anchor)}
      onClose={handleNotificationsMenuClose}
    >
      <InfiniteScroll
        height={400}
        className={classes.scroller}
        dataLength={notifications.items.length}
        next={loadMore}
        hasMore={notifications.hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
          </Grid>
        }
      >
        <List className={classes.root}>
          {notifications.items && notifications.items.length
            ? notifications.items.map((notification, index) => (
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
      </InfiniteScroll>
    </StyledMenu>
  );
};

export default NotificationsMenu;
