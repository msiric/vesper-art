import create from "zustand";
import {
  deleteArtwork,
  editArtwork,
  patchArtwork,
} from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import { deleteEmptyValues, formatValues } from "../../utils/helpers.js";

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
        cover: {},
        media: {},
        tags: [],
      },
    },
    loading: true,
    error: false,
  },
  capabilities: {
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
  fetchCapabilities: async ({ stripeId }) => {
    try {
      const { data } = await getUser.request({ stripeId });
      set((state) => ({
        ...state,
        capabilities: { data: data.capabilities, loading: false, error: false },
      }));
    } catch (err) {}
  },
  updateArtwork: async ({ artworkId, values }) => {
    const data = deleteEmptyValues(formatValues(values));
    const formData = new FormData();
    for (let value of Object.keys(data)) {
      if (Array.isArray(data[value])) {
        formData.append(value, JSON.stringify(data[value]));
      } else {
        formData.append(value, data[value]);
      }
    }
    await patchArtwork.request({
      artworkId,
      data: formData,
    });
  },
  deleteArtwork: async ({ artworkId }) => {
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
