import create from "zustand";
import { postArtwork } from "../../services/artwork";
import { getUser } from "../../services/stripe";
import {
  deleteEmptyValues,
  formatArtworkValues,
  resolveAsyncError,
} from "../../utils/helpers";

const initialState = {
  capabilities: {
    data: {},
    loading: true,
    error: { retry: false, message: "" },
  },
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
    for (let value of Object.keys(data)) {
      if (Array.isArray(data[value])) {
        formData.append(value, JSON.stringify(data[value]));
      } else {
        formData.append(value, data[value]);
      }
    }
    try {
      await postArtwork.request({ data: formData });
    } catch (err) {
      console.log(err);
    }
  },
  resetCapabilities: () => {
    set({ ...initialState });
  },
});

export const useArtworkCreate = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
