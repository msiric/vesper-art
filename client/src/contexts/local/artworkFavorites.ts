import create from "zustand";
import { getFavorites as getArtworkFavorites } from "../../services/artwork";

const initialState = {
  favorites: { data: 0, loading: true, error: false },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchFavorites: async ({ artworkId, userId, cursor, limit }) => {
    const { data } = await getArtworkFavorites.request({ artworkId });
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
    set({ ...initialState });
  },
});

export const useArtworkFavorites = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
