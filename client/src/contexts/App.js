import React, { createContext, useReducer } from "react";

const store = {
  loading: true,
  error: false,
  theme: "dark",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setApp":
      return {
        ...state,
        loading: action.loading,
        error: action.error,
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
