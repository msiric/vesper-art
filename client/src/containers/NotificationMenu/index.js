import React from "react";
import { useHistory } from "react-router-dom";
import EmptySection from "../../components/EmptySection/index.js";
import InfiniteList from "../../components/InfiniteList/index.js";
import NotificationItem from "../../components/NotificationItem/index.js";
import { useEventsStore } from "../../contexts/global/events.js";
import { useUserStore } from "../../contexts/global/user.js";
import Divider from "../../domain/Divider";
import List from "../../domain/List";
import Menu from "../../domain/Menu";
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
  const toggleMenu = useEventsStore((state) => state.toggleMenu);
  const redirectUser = useEventsStore((state) => state.redirectUser);
  const readNotification = useEventsStore((state) => state.readNotification);
  const unreadNotification = useEventsStore(
    (state) => state.unreadNotification
  );

  const classes = notificationMenuStyles();

  const history = useHistory();

  return (
    <Menu
      open={!!anchor}
      anchorEl={anchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={(e) => toggleMenu({ event: e, userId })}
      className={classes.menu}
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
          <List className={classes.list} disablePadding>
            {notifications.map((notification) => (
              <>
                <Divider />
                <NotificationItem
                  notification={notification}
                  handleRedirectClick={redirectUser}
                  handleReadClick={readNotification}
                  handleUnreadClick={unreadNotification}
                  isUpdating={isUpdating}
                  readNotification={readNotification}
                  toggleMenu={toggleMenu}
                  userId={userId}
                />
                <Divider />
              </>
            ))}
          </List>
        ) : (
          <EmptySection label="No notifications" loading={loading} />
        )}
      </InfiniteList>
    </Menu>
  );
};

export default NotificationsMenu;
