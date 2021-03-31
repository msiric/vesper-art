import { loadStripe } from "@stripe/stripe-js";
import create from "zustand";
import { stripe } from "../../../../config/secret";

const initialState = {
  stripe: {
    data: null,
    error: false,
    loading: true,
  },
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchStripe: async () => {
    try {
      // $TODO stripe.publishableKey || "" -> temp fix
      const data = await loadStripe(stripe.publishableKey || "");
      set((state) => ({
        ...state,
        stripe: {
          ...state.stripe,
          data,
          loading: false,
          error: false,
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        stripe: { ...state.stripe, loading: false, error: true },
      }));
    }
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useOrderStripe = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
