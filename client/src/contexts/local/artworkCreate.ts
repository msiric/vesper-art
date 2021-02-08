import create from "zustand";
import { getUser } from "../../services/stripe";

const initialState = {
  capabilities: { data: {}, loading: true, error: false },
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchCapabilities: async ({ stripeId }) => {
    try {
      const { data } = await getUser.request({ stripeId });
      set((state) => ({
        ...state,
        capabilities: { data: data.capabilities, loading: false, error: false },
      }));
    } catch (err) {}
  },
  resetCapabilities: () => {
    set({ ...initialState });
  },
});

export const useArtworkCreate = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
