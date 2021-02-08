import create from "zustand";
import { deleteArtwork } from "../../services/artwork";
import { getUploads } from "../../services/user";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  uploads: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
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
    set((state) => ({
      ...state,
      uploads: { ...state.uploads, loading: true, error: false },
    }));
    const uploads = get().uploads;
    const { data } = await getUploads.request({
      userId,
      cursor: uploads.cursor,
      limit: uploads.limit,
    });
    set((state) => ({
      ...state,
      uploads: {
        ...state.uploads,
        data: [...state.uploads.data, ...data.artwork],
        loading: false,
        error: false,
        hasMore: data.artwork.length < state.uploads.limit ? false : true,
        cursor: resolvePaginationId(data.artwork),
      },
    }));
  },
  removeArtwork: async ({ artworkId }) => {
    set((state) => ({ ...state, isDeleting: true }));
    await deleteArtwork.request({
      artworkId,
    });
    set((state) => ({
      ...state,
      artwork: {
        ...state.artwork,
        data: state.uploads.data.filter((item) => item.id !== artworkId),
      },
      modal: { ...state.modal, id: null, open: false },
      isDeleting: false,
    }));
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
