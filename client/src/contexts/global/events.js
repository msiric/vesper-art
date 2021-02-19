import create from "zustand";

const initialState = {
  notifications: {
    items: [],
    count: 0,
    opened: false,
    limit: 50,
    hasMore: true,
    cursor: "",
    limit: 10,
    isLoading: false,
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
  incrementNotification: ({ notification, cursor }) => {
    set((state) => {
      console.log(
        "INCREMENT",
        state.notifications,
        notification,
        state.notifications.items,
        [notification].concat(state.notifications.items)
      );

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
  updateSearch: ({ search }) => {
    set((state) => ({
      ...state,
      search: search,
    }));
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
