import create from "zustand";
import { formatArtworkValues } from "../../../../common/helpers";
import { postArtwork } from "../../services/artwork";
import { getUser } from "../../services/stripe";
import { deleteEmptyValues, resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  requirements: {
    data: {},
    loading: false,
    error: { retry: false, redirect: false, message: "" },
  },
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchRequirements: async ({ stripeId }) => {
    try {
      set((state) => ({
        ...state,
        requirements: {
          ...state.requirements,
          loading: true,
        },
      }));
      const { data } = await getUser.request({ stripeId });
      set((state) => ({
        ...state,
        requirements: {
          ...state.requirements,
          data: data.account.requirements.pending_verification,
          loading: false,
          error: { ...initialState.requirements.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        requirements: {
          ...state.requirements,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  createArtwork: async ({ values }) => {
    const data = deleteEmptyValues(formatArtworkValues(values));
    const formData = new FormData();
    for (const value of Object.keys(data)) {
      if (Array.isArray(data[value])) {
        formData.append(value, JSON.stringify(data[value]));
      } else {
        formData.append(value, data[value]);
      }
    }
    await postArtwork.request({ data: formData });
  },
  resetRequirements: () => {
    set({ ...initialState });
  },
});

export const useArtworkCreate = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
