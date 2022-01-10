import create from "zustand";
import { getNotifications, patchRead, patchUnread } from "../../services/user";
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
    limit: 10,
    loading: true,
    fetching: false,
    initialized: false,
    connected: false,
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
        isLoading:
          typeof notifications.isLoading !== "undefined"
            ? notifications.isLoading
            : state.notifications.isLoading,
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
        isLoading:
          typeof notifications.isLoading !== "undefined"
            ? notifications.isLoading
            : state.notifications.isLoading,
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
        isLoading:
          typeof notifications.isLoading !== "undefined"
            ? notifications.isLoading
            : state.notifications.isLoading,
      },
      search: typeof search !== "undefined" ? search : state.search,
    }));
  },
  fetchNotifications: async ({ event, userId, shouldFetch = false }) => {
    const notifications = get().notifications;
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
      try {
        const notifications = get().notifications;
        set((state) => ({
          ...state,
          notifications: {
            ...state.notifications,
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
            items: [...state.notifications.items].concat(data.notifications),
            hasMore:
              data.notifications.length < state.notifications.limit
                ? false
                : true,
            cursor: resolvePaginationId(data.notifications),
            loading: false,
            fetching: false,
            connected: true,
            initialized: true,
            error: { ...initialState.notifications.error },
          },
        }));
      } catch (err) {
        console.log("error", err);
        set((state) => ({
          ...state,
          notifications: {
            ...state.notifications,
            loading: false,
            fetching: false,
            connected: state.notifications.initialized,
            error: resolveAsyncError(err, true),
          },
        }));
      }
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
      ...state,
      notifications: {
        ...state.notifications,
        anchor: null,
        opened: false,
        connected: false,
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
  incrementNotification: ({ notification, cursor }) => {
    set((state) => {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.opened
            ? [notification].concat(state.notifications.items)
            : state.notifications.items,
          count: state.notifications.count + 1,
          // $TODO still not implemented
          cursor: state.notifications.opened ? cursor : "",
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
  updateLoading: ({ notifications }) => {
    set((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        isLoading: notifications.isLoading,
      },
    }));
  },
  resetEvents: () => {
    set({ ...initialState });
  },
});

export const useEventsStore = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
