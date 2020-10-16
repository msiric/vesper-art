import React, { createContext, useReducer } from "react";

const store = {
  events: {
    messages: {
      items: [],
      count: 0,
    },
    notifications: {
      items: [],
      count: 0,
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 10,
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setEvents":
      return {
        ...state,
        events: {
          messages: action.messages,
          notifications: action.notifications,
        },
      };
    case "resetEvents":
      return {
        ...state,
        events: {
          messages: {
            items: [],
            count: 0,
          },
          notifications: {
            items: [],
            count: 0,
            hasMore: true,
            dataCursor: 0,
            dataCeiling: 10,
          },
        },
      };
    case "updateMessages":
      return {
        ...state,
        events: {
          ...state.events,
          messages: {
            ...state.messages,
            count: state.user.messages.count + action.messages,
          },
        },
      };
    case "updateNotifications":
      return {
        ...state,
        events: {
          ...state.events,
          notifications: {
            ...state.notifications,
            items:
              typeof action.notifications.items !== "undefined"
                ? action.notifications.items
                : state.events.notifications.items,
            count:
              typeof action.notifications.count !== "undefined"
                ? state.events.notifications.count + action.notifications.count
                : state.events.notifications.count,
            hasMore:
              typeof action.notifications.hasMore !== "undefined"
                ? action.notifications.hasMore
                : state.events.notifications.hasMore,
            dataCursor:
              typeof action.notifications.dataCursor !== "undefined"
                ? action.notifications.dataCursor
                : state.events.notifications.dataCursor,
            dataCeiling:
              typeof action.notifications.dataCeiling !== "undefined"
                ? action.notifications.dataCeiling
                : state.events.notifications.dataCeiling,
          },
        },
      };
    case "updateEvents":
      return {
        ...state,
        events: {
          ...state.events,
          messages: action.messages,
          notifications: action.notifications,
        },
      };
    case "getState":
      return { ...state };
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
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext({
  eventsContext: store,
  eventsDispatch: reducer,
});

export default Events;
