import create from "zustand";
import { getArtwork } from "../../services/artwork.js";
import {
  getBarState,
  resolveAsyncError,
  resolvePaginationId,
} from "../../utils/helpers";

const initialState = {
  artwork: {
    data: [],
    loading: true,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 20,
    error: {
      refetch: false,
      message: "",
    },
  },
  bar: {
    visible: false,
    message: "",
  },
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchArtwork: async () => {
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
          initialized: true,
          loading: false,
          fetching: false,
          error: resolveAsyncError(err, true),
        },
      }));
    }
  },
  setBar: () => {
    const barState = getBarState();
    set((state) => ({
      ...state,
      bar: {
        ...state.bar,
        ...barState,
      },
    }));
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useHomeArtwork = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
