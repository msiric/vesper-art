import React, { createContext, useReducer } from "react";

const store = {
  messages: {
    items: [],
    count: 0,
    new: 0,
  },
  notifications: {
    items: [],
    count: 0,
    new: 0,
    limit: 50,
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 10,
  },
  search: "artwork",
};

const reducer = (state, action) => {
  console.log(action.type);
  switch (action.type) {
    case "setEvents":
      return {
        ...state,
        messages: {
          ...state.messages,
          items: typeof action.messages.items
            ? action.messages.items
            : state.messages.items,
          count: typeof action.messages.count
            ? action.messages.count
            : state.messages.count,
          new: typeof action.messages.new
            ? action.messages.new
            : state.messages.new,
        },
        notifications: {
          ...state.notifications,
          items:
            typeof action.notifications.items !== "undefined"
              ? action.notifications.items
              : state.notifications.items,
          count:
            typeof action.notifications.count !== "undefined"
              ? action.notifications.count
              : state.notifications.count,
          new:
            typeof action.notifications.new !== "undefined"
              ? action.notifications.new
              : state.notifications.new,
          hasMore:
            typeof action.notifications.hasMore !== "undefined"
              ? action.notifications.hasMore
              : state.notifications.hasMore,
          dataCursor:
            typeof action.notifications.dataCursor !== "undefined"
              ? action.notifications.dataCursor
              : state.notifications.dataCursor,
          dataCeiling:
            typeof action.notifications.dataCeiling !== "undefined"
              ? action.notifications.dataCeiling
              : state.notifications.dataCeiling,
        },
        search: typeof action.search ? action.search : state.search,
      };
    case "resetEvents":
      return {
        ...state,
        messages: {
          items: [],
          count: 0,
          new: 0,
        },
        notifications: {
          items: [],
          count: 0,
          new: 0,
          hasMore: true,
          dataCursor: 0,
          dataCeiling: 10,
        },
        search: "artwork",
      };
    case "updateMessages":
      return {
        ...state,
        messages: {
          ...state.messages,
          items: typeof action.messages.items
            ? action.messages.items
            : state.messages.items,
          count: typeof action.messages.count
            ? action.messages.new
            : state.messages.count,
          new: typeof action.messages.new
            ? action.messages.new
            : state.messages.new,
        },
      };
    case "updateNotifications":
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items:
            typeof action.notifications.items !== "undefined"
              ? action.notifications.items
              : state.notifications.items,
          count:
            typeof action.notifications.count !== "undefined"
              ? action.notifications.count
              : state.notifications.count,
          new:
            typeof action.notifications.new !== "undefined"
              ? action.notifications.new
              : state.notifications.new,
          hasMore:
            typeof action.notifications.hasMore !== "undefined"
              ? action.notifications.hasMore
              : state.notifications.hasMore,
          dataCursor:
            typeof action.notifications.dataCursor !== "undefined"
              ? action.notifications.dataCursor
              : state.notifications.dataCursor,
          dataCeiling:
            typeof action.notifications.dataCeiling !== "undefined"
              ? action.notifications.dataCeiling
              : state.notifications.dataCeiling,
        },
      };
    case "updateEvents":
      return {
        ...state,
        messages: {
          ...state.messages,
          items: typeof action.messages.items
            ? action.messages.items
            : state.messages.items,
          count: typeof action.messages.count
            ? action.messages.count
            : state.messages.count,
          new: typeof action.messages.new
            ? action.messages.new
            : state.messages.new,
        },
        notifications: {
          ...state.notifications,
          items:
            typeof action.notifications.items !== "undefined"
              ? action.notifications.items
              : state.notifications.items,
          count:
            typeof action.notifications.count !== "undefined"
              ? action.notifications.count
              : state.notifications.count,
          new:
            typeof action.notifications.new !== "undefined"
              ? action.notifications.new
              : state.notifications.new,
          hasMore:
            typeof action.notifications.hasMore !== "undefined"
              ? action.notifications.hasMore
              : state.notifications.hasMore,
          dataCursor:
            typeof action.notifications.dataCursor !== "undefined"
              ? action.notifications.dataCursor
              : state.notifications.dataCursor,
          dataCeiling:
            typeof action.notifications.dataCeiling !== "undefined"
              ? action.notifications.dataCeiling
              : state.notifications.dataCeiling,
        },
        search:
          typeof action.search !== "undefined" ? action.search : state.search,
      };
    case "incrementNotifications":
      return {
        ...state,
        notifications: {
          ...state.notifications,
          count: state.notifications.count + 1,
          new: state.notifications.new + 1,
        },
      };
    case "decrementNotifications":
      return {
        ...state,
        notifications: {
          ...state.notifications,
          count: state.notifications.count - 1,
          new: state.notifications.new - 1,
        },
      };
    case "updateSearch":
      return {
        ...state,
        search: action.search,
      };
    default:
      return state;
  }
};

const Events = ({ children, definedState }) => {
  const [state, dispatch] = useReducer(
    reducer,
    definedState ? definedState : store
  );

  return (
    <EventsContext.Provider value={[state, dispatch]}>
      {children}
    </EventsContext.Provider>
  );
};

export const EventsContext = createContext({
  eventsStore: store,
  eventsDispatch: reducer,
});

export default Events;
