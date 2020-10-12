import { Box, Divider, Grid, List, Menu, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Context } from "../../context/Store.js";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';
import NotificationItem from './NotificationItem.js';
import NotificationsMenuStyles from './NotificationsMenu.style.js';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    width: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
  loadMore,
}) => {
  const [store, dispatch] = useContext(Context);
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
          {store.user.notifications.loading || (notifications.items && notifications.items.length)
            ? notifications.items.map((notification, index) => <List className={classes.root}>
                <>
                  {index === 0 ? <Divider /> : null}
                  <NotificationItem
                    notification={notification}
                    handleRedirectClick={handleRedirectClick}
                    handleReadClick={handleReadClick}
                    handleUnreadClick={handleUnreadClick}
                  />
                </>
        </List>) : <Box style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Typography>No notifications</Typography></Box>}
      </InfiniteScroll>
    </StyledMenu>
  );
};

export default NotificationsMenu;
