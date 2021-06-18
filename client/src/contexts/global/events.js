import create from "zustand";
import { getNotifications, patchRead, patchUnread } from "../../services/user";
import { resolveAsyncError } from "../../utils/helpers";

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
    loading: false,
    fetching: false,
    initialized: false,
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
  toggleMenu: async ({ event, userId, fetching = false }) => {
    const target = event ? event.currentTarget : null;
    const notifications = get().notifications;
    if (
      fetching ||
      (notifications.items.length < notifications.limit &&
        !notifications.opened)
    ) {
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          ...(!fetching && { anchor: target }),
          loading: !state.notifications.initialized,
          fetching: state.notifications.initialized,
        },
      }));
      try {
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
            cursor:
              data.notifications[data.notifications.length - 1] &&
              data.notifications[data.notifications.length - 1].id,
            opened: true,
            loading: false,
            fetching: false,
            initialized: true,
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
            error: resolveAsyncError(err, true),
          },
        }));
      }
    } else {
      set((state) => ({
        ...state,
        notifications: {
          ...state.notifications,
          anchor: state.notifications.anchor ? null : target,
          loading: false,
          fetching: false,
        },
      }));
    }
  },
  readNotification: async ({ id }) => {
    try {
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
  unreadNotification: async ({ id }) => {
    try {
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
    event,
    notification,
    link,
    readNotification,
    toggleMenu,
    userId,
    history,
  }) => {
    toggleMenu({ event, userId });
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
