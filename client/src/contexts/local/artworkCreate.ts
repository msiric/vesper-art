import create from "zustand";
import { formatArtworkValues } from "../../../../common/helpers";
import { postArtwork } from "../../services/artwork";
import { getUser } from "../../services/stripe";
import { deleteEmptyValues, resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  capabilities: {
    data: {},
    loading: false,
    error: { retry: false, redirect: false, message: "" },
  },
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchCapabilities: async ({ stripeId }) => {
    try {
      set((state) => ({
        ...state,
        capabilities: {
          ...state.capabilities,
          loading: true,
        },
      }));
      const { data } = await getUser.request({ stripeId });
      set((state) => ({
        ...state,
        capabilities: {
          ...state.capabilities,
          data: data.capabilities,
          loading: false,
          error: { ...initialState.capabilities.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        capabilities: {
          ...state.capabilities,
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
  resetCapabilities: () => {
    set({ ...initialState });
  },
});

export const useArtworkCreate = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
