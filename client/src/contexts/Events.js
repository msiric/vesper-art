import { useReducer } from "react";
import { createContainer } from "react-tracked";

export const eventsStore = {
  messages: {
    items: [],
    count: 0,
    opened: false,
  },
  notifications: {
    items: [],
    count: 0,
    opened: false,
    limit: 50,
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 10,
    isSubmitting: false,
  },
  search: "artwork",
};

export const eventsReducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTS":
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
          opened: typeof action.messages.opened
            ? action.messages.opened
            : state.messages.opened,
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
          opened: typeof action.notifications.opened
            ? action.notifications.opened
            : state.notifications.opened,
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
          isSubmitting:
            typeof action.notifications.isSubmitting !== "undefined"
              ? action.notifications.isSubmitting
              : state.notifications.isSubmitting,
        },
        search:
          typeof action.search !== "undefined" ? action.search : state.search,
      };
    case "RESET_EVENTS":
      return {
        ...state,
        messages: {
          items: [],
          count: 0,
          opened: false,
        },
        notifications: {
          items: [],
          count: 0,
          opened: false,
          limit: 50,
          hasMore: true,
          dataCursor: 0,
          dataCeiling: 10,
          isSubmitting: false,
        },
        search: "artwork",
      };
    case "UPDATE_MESSAGES":
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
          opened: typeof action.messages.opened
            ? action.messages.opened
            : state.messages.opened,
        },
      };
    case "UPDATE_NOTIFICATIONS":
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
          opened: typeof action.notifications.opened
            ? action.notifications.opened
            : state.notifications.opened,
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
          isSubmitting:
            typeof action.notifications.isSubmitting !== "undefined"
              ? action.notifications.isSubmitting
              : state.notifications.isSubmitting,
        },
      };
    case "UPDATE_EVENTS":
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
          opened: typeof action.messages.opened
            ? action.messages.opened
            : state.messages.opened,
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
          opened: typeof action.notifications.opened
            ? action.notifications.opened
            : state.notifications.opened,
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
          isSubmitting:
            typeof action.notifications.isSubmitting !== "undefined"
              ? action.notifications.isSubmitting
              : state.notifications.isSubmitting,
        },
        search:
          typeof action.search !== "undefined" ? action.search : state.search,
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: {
          ...state.notifications,
          items: [action.notification].concat(state.notifications.items),
          count: state.notifications.count + 1,
          dataCursor: state.notifications.dataCursor + 1,
        },
      };
    case "UPDATE_SEARCH":
      return {
        ...state,
        search: action.search,
      };
    case "NOTIFICATION_SUBMITTING":
      return {
        ...state,
        notifications: {
          ...state.notifications,
          isSubmitting: action.notifications.isSubmitting,
        },
      };
    default:
      return state;
  }
};

const useValue = ({ reducer, store }) => useReducer(reducer, store);
export const { Provider, useTracked } = createContainer(useValue);

// const Events = ({ children, definedState }) => {
//   const [state, dispatch] = useReducer(
//     reducer,
//     definedState ? definedState : store
//   );

//   return (
//     <EventsContext.Provider value={[state, dispatch]}>
//       {children}
//     </EventsContext.Provider>
//   );
// };

// export const EventsContext = createContext({
//   eventsStore: store,
//   eventsDispatch: reducer,
// });

// export default Events;
