import { useReducer } from "react";
import { createContainer } from "react-tracked";

export const userStore = {
  authenticated: false,
  token: null,
  id: null,
  name: null,
  email: null,
  avatar: null,
  height: null,
  width: null,
  stripeId: null,
  country: null,
  favorites: {},
  intents: {},
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        authenticated: action.authenticated,
        token: action.token,
        id: action.id,
        name: action.name,
        email: action.email,
        avatar: action.avatar,
        stripeId: action.stripeId,
        country: action.country,
        favorites: action.favorites,
        intents: action.intents,
      };
    case "UPDATE_USER":
      return {
        ...state,
        token: action.token,
        email: action.email,
        avatar: action.avatar,
        stripeId: action.stripeId,
        country: action.country,
        favorites: action.favorites,
        intents: action.intents,
      };
    case "RESET_USER":
      return {
        ...state,
        authenticated: false,
        token: null,
        id: null,
        name: null,
        email: null,
        avatar: null,
        height: null,
        width: null,
        stripeId: null,
        country: null,
        favorites: {},
        intents: {},
      };
    case "UPDATE_TOKEN":
      return {
        ...state,
        token: action.token,
      };
    case "UPDATE_FAVORITES":
      return {
        ...state,
        favorites: { ...state.favorites, ...action.favorites },
      };
    default:
      return state;
  }
};

const useValue = ({ reducer, store }) => useReducer(reducer, store);
export const { Provider, useTracked } = createContainer(useValue);

// const User = ({ children, definedState }) => {
//   const [state, dispatch] = useReducer(
//     reducer,
//     definedState ? definedState : store
//   );

//   return (
//     <UserContext.Provider value={[state, dispatch]}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const UserContext = createContext({
//   userStore: store,
//   userDispatch: reducer,
// });

// export default User;
