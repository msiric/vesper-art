import React, { createContext, useReducer } from 'react';

const store = {
  main: {
    loading: true,
    auth: 'jwt',
    brand: 'test',
    theme: 'light',
  },
  user: {
    authenticated: false,
    id: null,
    name: null,
    email: null,
    photo: null,
    saved: {},
    cart: {},
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
          auth: action.auth,
          brand: action.brand,
          theme: action.theme,
        },
        user: {
          authenticated: action.authenticated,
          id: action.id,
          name: action.name,
          email: action.email,
          photo: action.photo,
          messages: action.messages,
          notifications: action.notifications,
          saved: action.saved,
          cart: action.cart,
          cartSize: action.cartSize,
        },
      };
    case 'setMain':
      return {
        ...state,
        main: {
          loading: action.loading,
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
          id: action.id,
          name: action.name,
          email: action.email,
          photo: action.photo,
          messages: action.messages,
          notifications: action.notifications,
          saved: action.saved,
          cart: action.cart,
          cartSize: action.cartSize,
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
