import { initialState as eventsState } from "@contexts/global/events";
import create from "zustand";
import {
  postEmail,
  postLogin,
  postRecover,
  postResend,
  postReset,
  postSignup,
} from "../../services/auth";
import { postLogout } from "../../services/user";

export const initialState = {
  authenticated: false,
  token: null,
  id: null,
  name: null,
  fullName: null,
  email: null,
  avatar: null,
  height: null,
  width: null,
  stripeId: null,
  onboarded: null,
  country: null,
  anchor: null,
  favorites: {},
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  setUser: ({
    authenticated,
    token,
    id,
    name,
    fullName,
    email,
    avatar,
    stripeId,
    onboarded,
    country,
    favorites,
  }) => {
    set((state) => ({
      ...state,
      authenticated,
      token,
      id,
      name,
      fullName,
      email,
      avatar,
      stripeId,
      onboarded,
      country,
      favorites,
    }));
  },
  updateUser: ({
    token,
    email,
    avatar,
    stripeId,
    onboarded,
    country,
    favorites,
  }) => {
    set((state) => ({
      ...state,
      token,
      email,
      avatar,
      stripeId,
      onboarded,
      country,
      favorites,
    }));
  },
  updateOnboarded: ({ onboarded }) => {
    set((state) => ({
      ...state,
      onboarded,
    }));
  },
  updateToken: ({ token }) => {
    set((state) => ({
      ...state,
      token,
    }));
  },
  updateFavorites: ({ favorites }) => {
    set((state) => ({
      ...state,
      favorites: { ...state.favorites, ...favorites },
    }));
  },
  recoverPassword: async ({ data, history }) => {
    try {
      await postRecover.request({ data });
      history.push({
        pathname: "/login",
        state: { message: "Reset link sent to your email" },
      });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  authenticateUser: async ({ data, setUser, setEvents, history }) => {
    try {
      const { data: response } = await postLogin.request({ data });

      if (response.user) {
        setUser({
          authenticated: true,
          token: response.accessToken,
          id: response.user.id,
          name: response.user.name,
          fullName: response.user.fullName,
          email: response.user.email,
          avatar: response.user.avatar,
          stripeId: response.user.stripeId,
          onboarded: response.user.onboarded,
          country: response.user.country,
          favorites: response.user.favorites.reduce((object, item) => {
            object[item.artworkId] = true;
            return object;
          }, {}),
        });
        setEvents({
          notifications: {
            items: [],
            count: response.user.notifications,
            hasMore: true,
            cursor: "",
            limit: eventsState.notifications.limit,
          },
        });
      }
      history.push("/");
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  resendToken: async ({ data, history }) => {
    try {
      await postResend.request({ data });
      history.push({
        pathname: "/login",
        state: { message: "Verification link sent to your email" },
      });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  resetPassword: async ({ resetToken, data, history }) => {
    try {
      const userId = get().id;
      await postReset.request({ userId, resetToken, data });
      history.push({
        pathname: "/login",
        state: { message: "Password successfully changed" },
      });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  registerUser: async ({ data }) => {
    try {
      await postSignup.request({ data });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  updateEmail: async ({ data }) => {
    try {
      await postEmail.request({ data });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  toggleMenu: ({ event }) => {
    set((state) => ({
      ...state,
      anchor: state.anchor ? null : event.currentTarget,
    }));
  },
  redirectUser: ({ event, link, toggleMenu, history }) => {
    toggleMenu({ event });
    history.push(link);
  },
  unauthenticateUser: async ({
    socket,
    resetUser,
    resetEvents,
    toggleMenu,
    history,
  }) => {
    try {
      if (socket?.instance) socket.instance.emit("disconnectUser");
      await postLogout.request();
      toggleMenu({ event: window.event });
      resetUser();
      resetEvents();
      history.push(window.location.pathname);
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  resetUser: () => {
    set({ ...initialState });
  },
});

export const useUserStore = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
