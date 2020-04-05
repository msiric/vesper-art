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
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setToken':
      return {
        ...state,
        user: {
          token: action.user.token,
          id: action.user.id,
          name: action.user.name,
          role: action.user.role,
          email: action.user.email,
          avatar: action.user.avatar,
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
