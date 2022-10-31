import create from "zustand";
import { getArtwork, getFavorites } from "../../services/user";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

export const initialState = {
  artwork: {
    data: [],
    loading: false,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 8,
    error: {
      refetch: false,
      message: "",
    },
  },
  favorites: {
    data: [],
    loading: false,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 8,
    error: {
      refetch: false,
      message: "",
    },
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
    try {
      set((state) => ({
        ...state,
        artwork: {
          ...state.artwork,
          loading: !state.artwork.initialized,
          fetching: state.artwork.initialized,
          error: {
            ...initialState.artwork.error,
          },
        },
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
          fetching: false,
          initialized: true,
          error: { ...initialState.artwork.error },
          hasMore: data.artwork.length < state.artwork.limit ? false : true,
          cursor: resolvePaginationId(data.artwork),
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        artwork: {
          ...state.artwork,
          loading: false,
          fetching: false,
          initialized: true,
          error: resolveAsyncError(err, true),
        },
      }));
    }
  },
  fetchFavorites: async ({ userUsername }) => {
    try {
      set((state) => ({
        ...state,
        favorites: {
          ...state.favorites,
          loading: !state.favorites.initialized,
          fetching: state.favorites.initialized,
          error: {
            ...initialState.favorites.error,
          },
        },
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
          fetching: false,
          initialized: true,
          error: { ...initialState.favorites.error },
          hasMore: data.favorites.length < state.favorites.limit ? false : true,
          cursor: resolvePaginationId(data.favorites),
        },
        tabs: { ...state.tabs, loading: false },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        favorites: {
          ...state.favorites,
          loading: false,
          fetching: false,
          initialized: true,
          error: resolveAsyncError(err, true),
        },
      }));
    }
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
