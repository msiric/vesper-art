import create from "zustand";
import { getOnboarded } from "../../services/stripe";
import { resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  details: {
    data: {},
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchDetails: async ({ updateOnboarded }) => {
    try {
      const { data } = await getOnboarded.request();
      set((state) => ({
        ...state,
        details: {
          data: data.onboarded,
          loading: false,
          error: { ...initialState.details.error },
        },
      }));
      if (data.onboarded) {
        updateOnboarded({ onboarded: data.onboarded });
      }
    } catch (err) {
      set((state) => ({
        ...state,
        details: {
          ...state.details,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  resetDetails: () => {
    set({ ...initialState });
  },
});

export const useUserOnboarded = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
