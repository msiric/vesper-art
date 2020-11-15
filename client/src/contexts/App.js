import { useReducer } from "react";
import { createContainer } from "react-tracked";

export const appStore = {
  loading: true,
  error: false,
  theme: "dark",
};

export const appReducer = (state, action) => {
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

const useValue = ({ reducer, store }) => useReducer(reducer, store);
export const { Provider, useTracked } = createContainer(useValue);

// const App = ({ children, definedState }) => {
//   const [state, dispatch] = useReducer(
//     reducer,
//     definedState ? definedState : store
//   );

//   return (
//     <AppContext.Provider value={[state, dispatch]}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const AppContext = createContext({
//   appStore: store,
//   appDispatch: reducer,
// });

// export default App;
