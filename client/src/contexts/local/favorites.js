import create from "zustand";
import { getFavorites } from "../../services/artwork";

const initialState = {
  favorites: { data: 0, loading: true, error: false },
};

const initState = () => ({
  ...initialState,
});

const initActions = (set) => ({
  fetchFavorites: async ({ artworkId }) => {
    // Not implemented
    const { data } = await getFavorites.request({
      artworkId,
    });
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
});

export const useArtworkStore = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
