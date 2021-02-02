import create from "zustand";

const initialState = {
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

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  setUser: ({
    authenticated,
    token,
    id,
    name,
    email,
    avatar,
    stripeId,
    country,
    favorites,
    intents,
  }) => {
    set((state) => ({
      ...state,
      authenticated,
      token,
      id,
      name,
      email,
      avatar,
      stripeId,
      country,
      favorites,
      intents,
    }));
  },
  updateUser: ({
    token,
    email,
    avatar,
    stripeId,
    country,
    favorites,
    intents,
  }) => {
    set((state) => ({
      ...state,
      token,
      email,
      avatar,
      stripeId,
      country,
      favorites,
      intents,
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
  resetUser: () => {
    set({ ...initialState });
  },
});

export const useUserStore = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
