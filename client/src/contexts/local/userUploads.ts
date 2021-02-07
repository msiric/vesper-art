import create from "zustand";
import { getGallery } from "../../services/artwork";
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
    const { data } = await getGallery.request({
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
        cursor: resolvePaginationId(data.uploads),
      },
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
