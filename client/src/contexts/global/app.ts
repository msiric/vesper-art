import create from "zustand";

export const initialState = {
  loading: true,
  error: false,
  theme: "dark",
  app: "Vesper",
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  setApp: ({ loading, error, theme }) => {
    set((state) => ({
      ...state,
      loading,
      error,
      theme,
    }));
  },
  resetApp: () => {
    set({ ...initialState });
  },
});

export const useAppStore = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
