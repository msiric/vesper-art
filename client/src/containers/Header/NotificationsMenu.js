import { Box, Divider, List, Menu, Typography } from "@material-ui/core";
import React from "react";
import InfiniteList from "../../components/InfiniteList/index.js";
import { useEventsStore } from "../../contexts/global/events.js";
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
  const notifications = useEventsStore((state) => state.notifications);

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
      <InfiniteList
        height={400}
        dataLength={notifications.items.length}
        next={loadMore}
        hasMore={notifications.hasMore}
      >
        {loading || (notifications.items && notifications.items.length) ? (
          <List
            className={classes.root}
            style={{ width: "100%", maxWidth: 280 }}
            disablePadding
          >
            {notifications.items.map((notification, index) => (
              <>
                <Divider />
                <NotificationItem
                  notification={notification}
                  handleRedirectClick={handleRedirectClick}
                  handleReadClick={handleReadClick}
                  handleUnreadClick={handleUnreadClick}
                />
                <Divider />
              </>
            ))}
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
      </InfiniteList>
    </Menu>
  );
};

export default NotificationsMenu;
