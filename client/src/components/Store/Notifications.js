import React, { createContext, useReducer } from 'react';

const store = {
  user: {
    messages: 0,
    notifications: 0,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setNotifications':
      return {
        ...state,
        user: {
          messages: action.messages,
          notifications: action.notifications,
        },
      };
    default:
      return state;
  }
};

const Notifications = ({ children, definedState }) => {
  const [state, dispatch] = useReducer(
    reducer,
    definedState ? definedState : store
  );
  return (
    <Setting.Provider value={[state, dispatch]}>{children}</Setting.Provider>
  );
};

export const Setting = createContext({
  notifications: store,
  forward: reducer,
});

export default Notifications;
