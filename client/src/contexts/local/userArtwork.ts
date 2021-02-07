import create from "zustand";
import { getArtwork } from "../../services/user";
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
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchArtwork: async ({ userId, cursor, limit }) => {
    const { data } = await getArtwork.request({ userId, cursor, limit });
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

export const useUserArtwork = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
