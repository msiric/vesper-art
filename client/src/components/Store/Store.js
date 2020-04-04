import React, { createContext, useReducer } from 'react';

const store = {
  settings: {
    auth: 'jwt',
    theme: 'dark',
  },
  user: {
    token: '',
    id: '',
    name: '',
    role: '',
    email: '',
    avatar: '',
    authorized: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setToken':
      return {
        ...state,
        user: {
          token: action.token,
          id: action.id,
          name: action.name,
          role: action.role,
          email: action.email,
          avatar: action.avatar,
          authorized: action.authorized,
        },
      };
    case 'userLogin':
      return {
        ...state,
        user: {
          token: action.token,
          id: action.id,
          name: action.name,
          role: action.role,
          email: action.email,
          avatar: action.avatar,
          authorized: action.authorized,
        },
      };
    case 'userLogout':
      return {
        ...state,
        user: {
          token: '',
          id: '',
          name: '',
          role: '',
          email: '',
          avatar: '',
          authorized: false,
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
  state: store,
  dispatch: reducer,
});

export default Store;
