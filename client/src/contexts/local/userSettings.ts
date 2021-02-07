import create from "zustand";
import { getSettings } from "../../services/user.js";

const initialState = {
  user: {
    data: {},
    loading: true,
    error: false,
  },
  modal: {
    open: false,
  },
  isDeactivating: false,
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchSettings: async ({ userId }) => {
    const { data } = await getSettings.request({
      userId,
    });
    set((state) => ({
      ...state,
      user: { data: data.user, loading: false, error: false },
    }));
  },
  resetSettings: () => {
    set({ ...initialState });
  },
});

export const useUserSettings = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
