import { determineFetchingState, determineLoadingState } from "@utils/helpers";
import React from "react";
import { useHistory } from "react-router-dom";
import InfiniteList from "../../components/InfiniteList/index";
import LoadingBar from "../../components/LoadingBar/index";
import NotificationItem from "../../components/NotificationItem/index";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import Divider from "../../domain/Divider";
import List from "../../domain/List";
import Menu from "../../domain/Menu";
import notificationMenuStyles from "./styles";

const MENU_HEIGHT = 400;

const NotificationsMenu = () => {
  const userId = useUserStore((state) => state.id);

  const notifications = useEventsStore((state) => state.notifications.items);
  const initialized = useEventsStore(
    (state) => state.notifications.initialized
  );
  const hasMore = useEventsStore((state) => state.notifications.hasMore);
  const anchor = useEventsStore((state) => state.notifications.anchor);
  const loading = useEventsStore((state) => state.notifications.loading);
  const limit = useEventsStore((state) => state.notifications.limit);
  const fetching = useEventsStore((state) => state.notifications.fetching);
  const refreshing = useEventsStore((state) => state.notifications.refreshing);
  const isUpdating = useEventsStore((state) => state.notifications.isUpdating);
  const error = useEventsStore((state) => state.notifications.error);
  const fetchNotifications = useEventsStore(
    (state) => state.fetchNotifications
  );
  const closeMenu = useEventsStore((state) => state.closeMenu);
  const redirectUser = useEventsStore((state) => state.redirectUser);
  const readNotification = useEventsStore((state) => state.readNotification);
  const unreadNotification = useEventsStore(
    (state) => state.unreadNotification
  );

  const classes = notificationMenuStyles({ height: MENU_HEIGHT });

  const history = useHistory();

  const renderNotification = (notification, loading) => (
    <>
      <Divider />
      <NotificationItem
        notification={notification}
        handleRedirectClick={redirectUser}
        handleReadClick={readNotification}
        handleUnreadClick={unreadNotification}
        isUpdating={isUpdating}
        closeMenu={closeMenu}
        loading={loading}
      />
      <Divider />
    </>
  );

  return (
    <Menu
      open={!!anchor}
      anchorEl={anchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={closeMenu}
      className={classes.menu}
      PaperProps={{
        style: { minHeight: "100%" },
      }}
    >
      <InfiniteList
        dataLength={notifications ? notifications.length : 0}
        next={(e) =>
          fetchNotifications({ event: e, userId, shouldFetch: true })
        }
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        initialized={initialized}
        error={error.refetch}
        label="No notifications yet"
        type="list"
        overflow="hidden"
        height={MENU_HEIGHT}
        loaderHeight={!initialized && MENU_HEIGHT}
      >
        <List className={classes.list} disablePadding>
          {refreshing && <LoadingBar label="Refreshing notifications" />}
          {determineLoadingState(loading, limit, notifications).map(
            (notification) => renderNotification(notification, loading)
          )}
          {determineFetchingState(fetching, limit).map((notification) =>
            renderNotification(notification, fetching)
          )}
        </List>
      </InfiniteList>
    </Menu>
  );
};

export default NotificationsMenu;
