import { Box, Divider, List, Menu, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import InfiniteList from "../../components/InfiniteList/index.js";
import NotificationItem from "../../components/NotificationItem/index.js";
import { useEventsStore } from "../../contexts/global/events.js";
import { useUserStore } from "../../contexts/global/user.js";
import notificationMenuStyles from "./styles";

const NotificationsMenu = () => {
  const userId = useUserStore((state) => state.id);

  const notifications = useEventsStore((state) => state.notifications.items);
  const hasMore = useEventsStore((state) => state.notifications.hasMore);
  const anchor = useEventsStore((state) => state.notifications.anchor);
  const loading = useEventsStore((state) => state.notifications.loading);
  const fetching = useEventsStore((state) => state.notifications.fetching);
  const isUpdating = useEventsStore((state) => state.notifications.isUpdating);
  const refetch = useEventsStore((state) => state.notifications.error.refetch);
  const message = useEventsStore((state) => state.notifications.error.message);
  const toggleMenu = useEventsStore((state) => state.toggleMenu);
  const readNotification = useEventsStore((state) => state.readNotification);
  const unreadNotification = useEventsStore(
    (state) => state.unreadNotification
  );

  const classes = notificationMenuStyles();

  const history = useHistory();

  const handleRedirectClick = (e, notification, link) => {
    toggleMenu({ event: e, userId });
    history.push(link);
    if (!notification.read) readNotification({ id: notification.id });
  };

  return (
    <Menu
      open={!!anchor}
      anchorEl={anchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={(e) => toggleMenu({ event: e, userId })}
      className={classes.notificationMenu}
    >
      <InfiniteList
        height={400}
        dataLength={notifications ? notifications.length : 0}
        next={() => toggleMenu({ userId, fetching: true })}
        loading={loading || fetching}
        hasMore={hasMore}
        error={refetch}
        empty="No notifications yet"
      >
        {loading || (notifications && notifications.length) ? (
          <List
            className={classes.root}
            style={{ width: "100%", maxWidth: 280 }}
            disablePadding
          >
            {notifications.map((notification) => (
              <>
                <Divider />
                <NotificationItem
                  notification={notification}
                  handleRedirectClick={handleRedirectClick}
                  handleReadClick={readNotification}
                  handleUnreadClick={unreadNotification}
                  isUpdating={isUpdating}
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
