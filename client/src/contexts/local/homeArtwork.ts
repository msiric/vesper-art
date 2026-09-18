import create from "zustand";
import { getArtwork } from "../../services/artwork";
import {
  getBarState,
  getWrapperState,
  resolveAsyncError,
  resolvePaginationId,
} from "../../utils/helpers";

export const initialState = {
  artwork: {
    data: [],
    loading: false,
    fetching: false,
    initialized: false,
    hasMore: false,
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
  wrapper: {
    visible: false,
    message: "",
  },
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => {
  let generation = 0;
  return ({
  fetchArtwork: async () => {
    if (get().artwork.loading || get().artwork.fetching) return;
    const requestGeneration = generation;
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
      if (requestGeneration !== generation) return;
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
      if (requestGeneration !== generation) return;
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
  setWrapper: () => {
    const wrapperState = getWrapperState();
    set((state) => ({
      ...state,
      wrapper: {
        ...state.wrapper,
        ...wrapperState,
      },
    }));
  },
  resetArtwork: () => {
    generation += 1;
    set({ ...initialState });
  },
});
};

export const useHomeArtwork = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
