import React, { createContext, useReducer } from 'react';

const store = {
  main: {
    loading: true,
    error: false,
    auth: 'jwt',
    brand: 'test',
    theme: 'light',
    search: 'artwork',
  },
  user: {
    authenticated: false,
    token: null,
    id: null,
    name: null,
    email: null,
    photo: null,
    height: null,
    width: null,
    stripeId: null,
    country: null,
    messages: {
      items: [],
      count: 0,
    },
    notifications: {
      items: [],
      count: 0,
      hasMore: true,
      cursor: 0,
      ceiling: 10,
      anchor: null,
      loading: false,
    },
    saved: {},
    cart: {
      items: {},
      count: 0,
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setStore':
      return {
        ...state,
        main: {
          loading: action.loading,
          error: action.error,
          auth: action.auth,
          brand: action.brand,
          theme: action.theme,
          search: action.search,
        },
        user: {
          authenticated: action.authenticated,
          token: action.token,
          id: action.id,
          name: action.name,
          email: action.email,
          photo: action.photo,
          messages: action.messages,
          notifications: action.notifications,
          saved: action.saved,
          cart: action.cart,
          stripeId: action.stripeId,
          country: action.country,
        },
      };
    case 'setMain':
      return {
        ...state,
        main: {
          loading: action.loading,
          error: action.error,
          auth: action.auth,
          brand: action.brand,
          theme: action.theme,
          search: action.search,
        },
      };
    case 'setUser':
      return {
        ...state,
        user: {
          authenticated: action.authenticated,
          token: action.token,
          id: action.id,
          name: action.name,
          email: action.email,
          photo: action.photo,
          stripeId: action.stripeId,
          country: action.country,
          messages: action.messages,
          notifications: action.notifications,
          saved: action.saved,
          cart: action.cart,
        },
      };
    case 'updateUser':
      return {
        ...state,
        user: {
          ...state.user,
          token: action.token,
          email: action.email,
          photo: action.photo,
          stripeId: action.stripeId,
          country: action.country,
          messages: action.messages,
          notifications: {
            ...state.user.notifications,
            count: action.notifications.count,
          },
          saved: action.saved,
          cart: action.cart,
        },
      };
    case 'setSearch':
      return {
        ...state,
        main: {
          ...state.main,
          search: action.search,
        },
      };
    case 'resetUser':
      return {
        ...state,
        user: {
          authenticated: false,
          token: null,
          id: null,
          name: null,
          email: null,
          photo: null,
          height: null,
          width: null,
          stripeId: null,
          country: null,
          messages: {
            items: [],
            count: 0,
          },
          notifications: {
            items: [],
            count: 0,
            hasMore: true,
            cursor: 0,
            ceiling: 10,
            anchor: null,
            loading: false,
          },
          saved: {},
          cart: {
            items: {},
            count: 0,
          },
        },
      };
    case 'updateToken':
      return {
        ...state,
        user: {
          ...state.user,
          token: action.token,
        },
      };
    case 'updateCart':
      return {
        ...state,
        user: {
          ...state.user,
          cart: action.cart,
        },
      };
    case 'updateSaves':
      return {
        ...state,
        user: {
          ...state.user,
          saved: { ...state.user.saved, ...action.saved },
        },
      };
    case 'updateMessages':
      return {
        ...state,
        user: {
          ...state.user,
          messages: {
            ...state.messages,
            count: state.user.messages.count + action.messages,
          },
        },
      };
    case 'updateNotifications':
      return {
        ...state,
        user: {
          ...state.user,
          notifications: {
            ...state.notifications,
            items: action.notifications.items,
            count: state.user.notifications.count + action.notifications.count,
            hasMore: action.notifications.hasMore,
            cursor: action.notifications.cursor,
            ceiling: action.notifications.ceiling,
            anchor: action.notifications.anchor,
            loading: action.notifications.loading,
          },
        },
      };
    case 'updateEvents':
      return {
        ...state,
        user: {
          ...state.user,
          messages: action.messages,
          notifications: action.notifications,
        },
      };
    case 'getState':
      return { ...state };
    default:
      return state;
  }
};

const Store = ({ children, definedState }) => {
  const [state, dispatch] = useReducer(
    reducer,
    definedState ? definedState : store
  );

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext({
  store: store,
  dispatch: reducer,
});
export default Store;
