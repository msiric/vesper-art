import React, { createContext, useReducer } from "react";

const store = {
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
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
      };
    case "updateUser":
      return {
        ...state,
        token: action.token,
        email: action.email,
        photo: action.photo,
        stripeId: action.stripeId,
        country: action.country,
        saved: action.saved,
        intents: action.intents,
      };
    case "resetUser":
      return {
        ...state,
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
      };
    case "updateToken":
      return {
        ...state,
        token: action.token,
      };
    case "updateSaves":
      return {
        ...state,
        saved: { ...state.saved, ...action.saved },
      };
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
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export const UserContext = createContext({
  userStore: store,
  userDispatch: reducer,
});

export default User;
