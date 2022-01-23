import create from "zustand";
import {
  getNotifications,
  patchRead,
  patchUnread,
  restoreNotifications,
} from "../../services/user";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

const SEARCH_TYPES = {
  artwork: "artwork",
  users: "users",
};

const initialState = {
  notifications: {
    items: [],
    count: 0,
    opened: false,
    hasMore: true,
    cursor: "",
    limit: 5,
    loading: false,
    fetching: false,
    refreshing: false,
    initialized: false,
    updatedCount: false,
    error: {
      refetch: false,
      message: "",
    },
    anchor: null,
    isUpdating: false,
  },
  search: "artwork",
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  setEvents: ({ notifications, search }) => {
    set((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        items:
          typeof notifications.items !== "undefined"
            ? notifications.items
            : state.notifications.items,
        count:
          typeof notifications.count !== "undefined"
            ? notifications.count
            : state.notifications.count,
        opened:
          typeof notifications.opened !== "undefined"
            ? notifications.opened
            : state.notifications.opened,
        hasMore:
          typeof notifications.hasMore !== "undefined"
            ? notifications.hasMore
            : state.notifications.hasMore,
        cursor:
          typeof notifications.cursor !== "undefined"
            ? notifications.cursor
            : state.notifications.cursor,
        limit:
          typeof notifications.limit !== "undefined"
            ? notifications.limit
            : state.notifications.limit,
      },
      search: typeof search !== "undefined" ? search : state.search,
    }));
  },
  updateNotifications: ({ notifications }) => {
    set((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        items:
          typeof notifications.items !== "undefined"
            ? notifications.items
            : state.notifications.items,
        count:
          typeof notifications.count !== "undefined"
            ? notifications.count
            : state.notifications.count,
        opened:
          typeof notifications.opened !== "undefined"
            ? notifications.opened
            : state.notifications.opened,
        hasMore:
          typeof notifications.hasMore !== "undefined"
            ? notifications.hasMore
            : state.notifications.hasMore,
        cursor:
          typeof notifications.cursor !== "undefined"
            ? notifications.cursor
            : state.notifications.cursor,
        limit:
          typeof notifications.limit !== "undefined"
            ? notifications.limit
            : state.notifications.limit,
      },
    }));
  },
  updateCount: ({ enabled }) => {
    set((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        updatedCount: enabled,
      },
    }));
  },
  updateEvents: ({ notifications, search }) => {
    set((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        items:
          typeof notifications.items !== "undefined"
            ? notifications.items
            : state.notifications.items,
        count:
          typeof notifications.count !== "undefined"
            ? notifications.count
            : state.notifications.count,
        opened:
          typeof notifications.opened !== "undefined"
            ? notifications.opened
            : state.notifications.opened,
        hasMore:
          typeof notifications.hasMore !== "undefined"
            ? notifications.hasMore
            : state.notifications.hasMore,
        cursor:
          typeof notifications.cursor !== "undefined"
            ? notifications.cursor
            : state.notifications.cursor,
        limit:
          typeof notifications.limit !== "undefined"
            ? notifications.limit
            : state.notifications.limit,
      },
      search: typeof search !== "undefined" ? search : state.search,
    }));
  },
  fetchNotifications: async ({ event, userId, shouldFetch = false }) => {
    const notifications = get().notifications;
    const initialized = notifications.initialized;
    const target = shouldFetch ? notifications.anchor : event.currentTarget;
    if (notifications.initialized && !shouldFetch) {
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          opened: true,
          anchor: target,
        },
      }));
    } else {
      try {
        set((state) => ({
          ...state,
          notifications: {
            ...state.notifications,
            anchor: target,
            opened: true,
            loading: !state.notifications.initialized,
            fetching: state.notifications.initialized,
          },
        }));
        const { data } = await getNotifications.request({
          userId,
          cursor: notifications.cursor,
          limit: notifications.limit,
        });
        set((state) => ({
          ...state,
          notifications: {
            ...state.notifications,
            items: [...state.notifications.items, ...data.notifications],
            hasMore:
              data.notifications.length < state.notifications.limit
                ? false
                : true,
            cursor: resolvePaginationId(data.notifications),
            loading: false,
            fetching: false,
            initialized: true,
            error: { ...initialState.notifications.error },
          },
        }));
      } catch (err) {
        console.log("error", err);
        const resetEvents = get().resetEvents;
        initialized
          ? set((state) => ({
              ...state,
              notifications: {
                ...state.notifications,
                loading: false,
                fetching: false,
                error: resolveAsyncError(err, true),
              },
            }))
          : resetEvents();
      }
    }
  },
  refreshNotifications: async ({ userId }) => {
    try {
      const notifications = get().notifications;
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          refreshing: true,
        },
      }));
      const { data } = await restoreNotifications.request({
        userId,
        cursor: notifications.items[0].id,
      });
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          items: [...data.notifications, ...state.notifications.items],
          refreshing: false,
          error: { ...initialState.notifications.error },
        },
      }));
    } catch (err) {
      console.log("error", err);
      const disconnectMenu = get().disconnectMenu;
      disconnectMenu();
    }
  },
  closeMenu: () => {
    set((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        anchor: null,
        opened: false,
      },
    }));
  },
  disconnectMenu: () => {
    set((state) => ({
      ...initialState,
      notifications: {
        ...initialState.notifications,
        count: state.notifications.count,
        updatedCount: state.notifications.updatedCount,
      },
    }));
  },
  readNotification: async ({ event = window.event, id }) => {
    try {
      event.stopPropagation();
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          isUpdating: true,
        },
      }));
      await patchRead.request({ notificationId: id });
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.items.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          ),
          count: state.notifications.count - 1,
          isUpdating: false,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  unreadNotification: async ({ event = window.event, id }) => {
    try {
      event.stopPropagation();
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          isUpdating: true,
        },
      }));
      await patchUnread.request({ notificationId: id });
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.items.map((notification) =>
            notification.id === id
              ? { ...notification, read: false }
              : notification
          ),
          count: state.notifications.count + 1,
          isUpdating: false,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  prependNotification: ({ notification, cursor, count = 1 }) => {
    set((state) => {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items: [notification, ...state.notifications.items],
          count: state.notifications.count + count,
          cursor: cursor,
        },
      };
    });
  },
  incrementCount: () => {
    set((state) => {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          count: state.notifications.count + 1,
        },
      };
    });
  },
  toggleSearch: () => {
    const search = get().search;
    set((state) => ({
      ...state,
      search: search === "artwork" ? "users" : "artwork",
    }));
  },
  searchQuery: ({ values, history }) => {
    try {
      if (values.searchQuery.trim()) {
        const search = get().search;
        history.push(`/search?q=${values.searchQuery}&t=${search}`);
      }
    } catch (err) {
      console.log(err);
    }
  },
  redirectUser: ({
    notification,
    link,
    readNotification,
    closeMenu,
    history,
  }) => {
    closeMenu();
    history.push(link);
    if (!notification.read) readNotification({ id: notification.id });
  },
  resetEvents: () => {
    set({ ...initialState });
  },
});

export const useEventsStore = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
