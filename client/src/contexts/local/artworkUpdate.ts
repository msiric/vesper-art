import create from "zustand";
import { editArtwork } from "../../services/artwork.js";

const initialState = {
  artwork: {
    data: {},
    loading: true,
    error: false,
  },
  modal: {
    open: false,
  },
  isDeleting: false,
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchArtwork: async ({ artworkId }) => {
    try {
      const { data } = await editArtwork.request({
        artworkId,
      });
      set((state) => ({
        ...state,
        artwork: { data: data.artwork, loading: false, error: false },
      }));
    } catch (err) {}
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useArtworkUpdate = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
