import create from "zustand";
import {
  deleteArtwork,
  editArtwork,
  patchArtwork,
} from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import {
  deleteEmptyValues,
  formatArtworkValues,
  resolveAsyncError,
} from "../../utils/helpers.js";

const initialState = {
  artwork: {
    data: {
      current: {
        title: "",
        type: "",
        availability: "",
        license: "",
        use: "",
        personal: "",
        commercial: "",
        description: "",
        visibility: "",
        cover: {},
        media: {},
        tags: [],
      },
    },
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  capabilities: {
    data: {},
    loading: true,
    error: { retry: false, redirect: false, message: "" },
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
        artwork: {
          data: data.artwork,
          loading: false,
          error: { ...initialState.artwork.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        artwork: {
          ...state.artwork,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  fetchCapabilities: async ({ stripeId }) => {
    try {
      const { data } = await getUser.request({ stripeId });
      set((state) => ({
        ...state,
        capabilities: {
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
  updateArtwork: async ({ artworkId, values }) => {
    const data = deleteEmptyValues(formatArtworkValues(values));
    await patchArtwork.request({
      artworkId,
      data,
    });
  },
  removeArtwork: async ({ artworkId }) => {
    set((state) => ({ ...state, isDeleting: true }));
    await deleteArtwork.request({
      artworkId,
    });
    set((state) => ({ ...state, isDeleting: false }));
  },
  toggleModal: () => {
    set((state) => ({
      ...state,
      modal: { ...state.modal, open: !state.modal.open },
    }));
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useArtworkUpdate = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
