import create from "zustand";
import { getFavorites } from "../../services/user";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  favorites: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchFavorites: async ({ userId, cursor, limit }) => {
    const { data } = await getFavorites.request({ userId, cursor, limit });
    set((state) => ({
      ...state,
      favorites: {
        ...state.favorites,
        data: [...state.favorites.data, ...data.favorites],
        loading: false,
        error: false,
        hasMore: data.favorites.length < state.favorites.limit ? false : true,
        cursor: resolvePaginationId(data.favorites),
      },
    }));
  },
  resetFavorites: () => {
    set({ ...initialState });
  },
});

export const useUserFavorites = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
