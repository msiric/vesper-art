import { Box, Divider, Grid, List, Menu, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { EventsContext } from "../../contexts/Events.js";
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
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleNotificationsMenuClose}
      className={classes.notificationMenu}
      keepMounted
    >
      <InfiniteScroll
        height={400}
        className={classes.scroller}
        dataLength={eventsStore.notifications.items.length}
        next={loadMore}
        hasMore={
          eventsStore.notifications.hasMore &&
          eventsStore.notifications.items.length <
            eventsStore.notifications.limit
        }
        loader={
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
          </Grid>
        }
      >
        {loading ||
        (eventsStore.notifications.items &&
          eventsStore.notifications.items.length) ? (
          <List className={classes.root}>
            {eventsStore.notifications.items.map((notification, index) => (
              <>
                {index === 0 ? <Divider /> : null}
                <NotificationItem
                  notification={notification}
                  handleRedirectClick={handleRedirectClick}
                  handleReadClick={handleReadClick}
                  handleUnreadClick={handleUnreadClick}
                />
              </>
            ))}
            {eventsStore.notifications.items.length >= 50 && (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "16px 0",
                }}
              >
                <Typography>See all notifications</Typography>
              </Box>
            )}
          </List>
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
