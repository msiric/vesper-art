import React from "react";
import { useHistory } from "react-router-dom";
import InfiniteList from "../../components/InfiniteList/index";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotificationItem from "../../components/NotificationItem/index";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
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
  const error = useEventsStore((state) => state.notifications.error);
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
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        error={error.refetch}
        empty="No notifications yet"
        type="list"
      >
        <List
          className={`${classes.list} ${loading && classes.spinner}`}
          disablePadding
        >
          {!loading ? (
            notifications.map((notification) => (
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
            ))
          ) : (
            <LoadingSpinner styles={classes.spinner} />
          )}
        </List>
      </InfiniteList>
    </Menu>
  );
};

export default NotificationsMenu;
