import create from "zustand";
import { getArtwork } from "../../services/artwork.js";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 20,
  },
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchArtwork: async () => {
    set((state) => ({
      ...state,
      artwork: { ...state.artwork, loading: true, error: false },
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
        error: false,
        hasMore: data.artwork.length < state.artwork.limit ? false : true,
        cursor: resolvePaginationId(data.artwork),
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
