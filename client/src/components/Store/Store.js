import React, { createContext, useReducer } from 'react';

const store = {
  settings: {
    auth: 'jwt',
    theme: 'dark',
  },
  user: {
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
    case 'userLogin':
      return {
        ...state,
        user: {
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
