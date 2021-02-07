import create from "zustand";
import { getFavorites as getArtworkFavorites } from "../../services/artwork";
import { getFavorites as getUserFavorites } from "../../services/user";

enum StateType {
  ARTWORK_STATE = "ARTWORK_STATE",
  USER_STATE = "USER_STATE",
}

const artworkFavorites = {
  favorites: { data: 0, loading: true, error: false },
};

const userFavorites = {
  favorites: { data: [], loading: true, error: false },
};

const initState = (type: StateType) =>
  type === StateType.ARTWORK_STATE
    ? { ...artworkFavorites }
    : { ...userFavorites };

const initActions = (set, type: StateType) => ({
  fetchFavorites: async ({ artworkId, userId, cursor, limit }) => {
    const { data } =
      type === StateType.ARTWORK_STATE
        ? await getArtworkFavorites.request({ artworkId })
        : await getUserFavorites.request({ userId, cursor, limit });
    set((state) => ({
      ...state,
      favorites: { data: data.favorites, loading: false, error: false },
    }));
  },
  toggleFavorite: async ({ incrementBy }) => {
    set((state) => ({
      ...state,
      favorites: {
        ...state.favorites,
        data: state.favorites.data + incrementBy,
      },
    }));
  },
  resetFavorites: () => {
    set(initState(type));
  },
});

export const useArtworkFavorites = create((set) => ({
  ...initState(StateType.ARTWORK_STATE),
  ...initActions(set, StateType.ARTWORK_STATE),
}));

export const useUserFavorites = create((set) => ({
  ...initState(StateType.USER_STATE),
  ...initActions(set, StateType.USER_STATE),
}));
