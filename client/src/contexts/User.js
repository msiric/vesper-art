import React, { createContext, useReducer } from "react";

const store = {
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
    saved: {},
    intents: {},
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: {
          authenticated: action.authenticated,
          token: action.token,
          id: action.id,
          name: action.name,
          email: action.email,
          photo: action.photo,
          saved: action.saved,
          stripeId: action.stripeId,
          country: action.country,
          intents: action.intents,
        },
      };
    case "updateUser":
      return {
        ...state,
        user: {
          ...state.user,
          token: action.token,
          email: action.email,
          photo: action.photo,
          stripeId: action.stripeId,
          country: action.country,
          saved: action.saved,
          intents: action.intents,
        },
      };
    case "resetUser":
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
          saved: {},
          intents: {},
        },
      };
    case "updateToken":
      return {
        ...state,
        user: {
          ...state.user,
          token: action.token,
        },
      };
    case "updateSaves":
      return {
        ...state,
        user: {
          ...state.user,
          saved: { ...state.user.saved, ...action.saved },
        },
      };
    case "getUser":
      return { ...state };
    default:
      return state;
  }
};

const User = ({ children, definedState }) => {
  const [state, dispatch] = useReducer(
    reducer,
    definedState ? definedState : store
  );

  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext({
  userContext: store,
  userDispatch: reducer,
});

export default User;
