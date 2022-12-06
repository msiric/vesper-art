import create from "zustand";
import { deleteArtwork } from "../../services/artwork";
import { getMyArtwork } from "../../services/user";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

export const initialState = {
  uploads: {
    data: [],
    loading: true,
    hasMore: true,
    cursor: "",
    limit: 10,
    error: { retry: false, redirect: false, message: "" },
  },
  modal: {
    id: null,
    open: false,
  },
  isDeleting: false,
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchUploads: async ({ userId }) => {
    try {
      const uploads = get().uploads;
      const { data } = await getMyArtwork.request({
        userId,
      });
      set((state) => ({
        ...state,
        uploads: {
          ...state.uploads,
          data: [...state.uploads.data, ...data.artwork],
          loading: false,
          error: { ...initialState.uploads.error },
          hasMore: data.artwork.length < state.uploads.limit ? false : true,
          cursor: resolvePaginationId(data.artwork),
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        uploads: {
          ...state.uploads,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  removeArtwork: async ({ userId, artworkId }) => {
    try {
      set((state) => ({ ...state, isDeleting: true }));
      await deleteArtwork.request({
        userId,
        artworkId,
      });
      set((state) => ({
        ...state,
        uploads: {
          ...state.uploads,
          data: state.uploads.data.filter((item) => item.id !== artworkId),
        },
        modal: { ...state.modal, id: null, open: false },
        isDeleting: false,
      }));
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  openModal: ({ artworkId }) => {
    set((state) => ({
      ...state,
      modal: { ...state.modal, id: artworkId, open: true },
    }));
  },
  closeModal: () => {
    set((state) => ({
      ...state,
      modal: { ...state.modal, id: null, open: false },
    }));
  },
  resetUploads: () => {
    set({ ...initialState });
  },
});

export const useUserUploads = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
