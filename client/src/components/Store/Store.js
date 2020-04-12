import React, { createContext, useReducer } from 'react';

const store = {
  settings: {
    auth: 'jwt',
    brand: 'test',
    theme: 'dark',
  },
  user: {
    authenticated: false,
    id: null,
    name: null,
    email: null,
    photo: null,
    saved: {},
    cart: {},
  },
};

const reducer = (state, action) => {
  switch (action.type) {
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
