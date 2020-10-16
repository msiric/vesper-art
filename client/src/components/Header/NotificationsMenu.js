import { Box, Divider, Grid, List, Menu, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Context } from "../../contexts/Store.js";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";
import NotificationItem from "./NotificationItem.js";
import NotificationsMenuStyles from "./NotificationsMenu.style.js";

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
    <Menu
      anchorEl={notifications.anchor}
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
        {store.user.notifications.loading ||
        (notifications.items && notifications.items.length) ? (
          notifications.items.map((notification, index) => (
            <List className={classes.root}>
              <>
                {index === 0 ? <Divider /> : null}
                <NotificationItem
                  notification={notification}
                  handleRedirectClick={handleRedirectClick}
                  handleReadClick={handleReadClick}
                  handleUnreadClick={handleUnreadClick}
                />
              </>
            </List>
          ))
        ) : (
          <Box
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>No notifications</Typography>
          </Box>
        )}
      </InfiniteScroll>
    </Menu>
  );
};

export default NotificationsMenu;
