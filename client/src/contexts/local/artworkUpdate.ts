import create from "zustand";
import { featureFlags } from "../../../../common/constants";
import { formatArtworkValues } from "../../../../common/helpers";
import {
  deleteArtwork,
  editArtwork,
  patchArtwork,
} from "../../services/artwork";
import { getUser } from "../../services/stripe";
import { deleteEmptyValues, resolveAsyncError } from "../../utils/helpers";

export const initialState = {
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
      visibility: "",
    },
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  requirements: {
    data: [],
    loading: false,
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
  fetchArtwork: async ({ userId, artworkId }) => {
    try {
      const { data } = await editArtwork.request({
        userId,
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
  fetchRequirements: async ({ stripeId }) => {
    // FEATURE FLAG - stripe
    if (featureFlags.stripe) {
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
    }
  },
  updateArtwork: async ({ userId, artworkId, values }) => {
    try {
      const data = deleteEmptyValues(formatArtworkValues(values));
      await patchArtwork.request({
        userId,
        artworkId,
        data,
      });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  removeArtwork: async ({ userId, artworkId }) => {
    try {
      set((state) => ({ ...state, isDeleting: true }));
      await deleteArtwork.request({
        userId,
        artworkId,
      });
      set((state) => ({ ...state, isDeleting: false }));
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
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
