import create from "zustand";
import { getArtwork, getFavorites } from "../../services/user";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
  },
  favorites: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
  },
  tabs: {
    value: 0,
    revealed: false,
    loading: true,
  },
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchArtwork: async ({ userUsername }) => {
    set((state) => ({
      ...state,
      artwork: { ...state.artwork, loading: true, error: false },
    }));
    const artwork = get().artwork;
    const { data } = await getArtwork.request({
      userUsername,
      cursor: artwork.cursor,
      limit: artwork.limit,
    });
    set((state) => ({
      ...state,
      artwork: {
        ...state.artwork,
        data: [...state.artwork.data, ...data.artwork],
        loading: false,
        error: false,
        hasMore: data.artwork.length < state.artwork.limit ? false : true,
        cursor: resolvePaginationId(data.artwork),
      },
    }));
  },
  fetchFavorites: async ({ userUsername }) => {
    set((state) => ({
      ...state,
      favorites: { ...state.favorites, loading: true, error: false },
      tabs: { ...state.tabs, revealed: true },
    }));
    const favorites = get().favorites;
    const { data } = await getFavorites.request({
      userUsername,
      cursor: favorites.cursor,
      limit: favorites.limit,
    });
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
      tabs: { ...state.tabs, loading: false },
    }));
  },
  changeTab: ({ index }) => {
    set((state) => ({
      ...state,
      tabs: { ...state.tabs, value: index },
    }));
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useUserArtwork = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
