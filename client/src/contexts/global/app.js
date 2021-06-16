import create from "zustand";

const initialState = {
  loading: true,
  error: false,
  theme: "dark",
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
