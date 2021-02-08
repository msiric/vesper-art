import create from "zustand";

const initialState = {
  loading: true,
  fetching: false,
  artwork: { data: {}, loading: true, error: false },
  purchases: { data: {}, loading: true, error: false },
  covers: [],
  media: [],
  captions: [],
  index: null,
  display: "purchases",
  scroll: {
    hasMore: true,
    cursor: "",
    limit: 10,
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  resetGallery: () => {
    set({ ...initialState });
  },
});

export const useUserGallery = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
