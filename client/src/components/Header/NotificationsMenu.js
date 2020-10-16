import { Box, Divider, Grid, List, Menu, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { EventsContext } from "../../contexts/Events.js";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";
import NotificationItem from "./NotificationItem.js";
import NotificationsMenuStyles from "./NotificationsMenu.style.js";

const NotificationsMenu = ({
  anchorEl,
  loading,
  handleNotificationsMenuClose,
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
  loadMore,
}) => {
  const [eventsStore] = useContext(EventsContext);
  const classes = NotificationsMenuStyles();

  return (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleNotificationsMenuClose}
      className={classes.notificationMenu}
    >
      <InfiniteScroll
        height={400}
        className={classes.scroller}
        dataLength={eventsStore.notifications.items.length}
        next={loadMore}
        hasMore={eventsStore.notifications.hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
          </Grid>
        }
      >
        {loading ||
        (eventsStore.notifications.items &&
          eventsStore.notifications.items.length) ? (
          eventsStore.notifications.items.map((notification, index) => (
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
