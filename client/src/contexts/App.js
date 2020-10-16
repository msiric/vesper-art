import React, { createContext, useReducer } from "react";

const store = {
  loading: true,
  error: false,
  auth: "jwt",
  brand: "test",
  theme: "light",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setApp":
      return {
        ...state,
        loading: action.loading,
        error: action.error,
        auth: action.auth,
        brand: action.brand,
        theme: action.theme,
      };
    default:
      return state;
  }
};

const App = ({ children, definedState }) => {
  const [state, dispatch] = useReducer(
    reducer,
    definedState ? definedState : store
  );

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const AppContext = createContext({
  appStore: store,
  appDispatch: reducer,
});

export default App;
