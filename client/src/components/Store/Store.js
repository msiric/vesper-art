import React, { createContext, useReducer } from 'react';

const store = {
  main: {
    loading: true,
    error: false,
    auth: 'jwt',
    brand: 'test',
    theme: 'light',
  },
  user: {
    authenticated: false,
    token: null,
    id: null,
    name: null,
    email: null,
    photo: null,
    messages: null,
    notifications: null,
    saved: {},
    cart: {},
    stripeId: null,
    country: null,
    cartSize: null,
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
          cartSize: action.cartSize,
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
          messages: action.messages,
          notifications: action.notifications,
          saved: action.saved,
          cart: action.cart,
          stripeId: action.stripeId,
          country: action.country,
          cartSize: action.cartSize,
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
          messages: action.messages,
          notifications: action.notifications,
          saved: action.saved,
          cart: action.cart,
          stripeId: action.stripeId,
          country: action.country,
          cartSize: action.cartSize,
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
          messages: null,
          notifications: null,
          saved: {},
          cart: {},
          stripeId: null,
          country: null,
          cartSize: null,
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
          cartSize: action.cartSize,
        },
      };
    case 'updateSaves':
      return {
        ...state,
        user: {
          ...state.user,
          saved: action.saved,
        },
      };
    case 'updateMessages':
      return {
        ...state,
        user: {
          ...state.user,
          messages: state.user.messages + 1,
        },
      };
    case 'updateNotifications':
      return {
        ...state,
        user: {
          ...state.user,
          notifications: state.user.notifications + 1,
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
