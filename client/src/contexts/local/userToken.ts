import create from "zustand";
import { getToken } from "../../services/auth";

const initialState = {
  token: { data: false, loading: true, error: false },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchToken: async ({ tokenId }) => {
    await getToken.request({ tokenId });
    set((state) => ({
      ...state,
      token: { data: true, loading: false, error: false },
    }));
  },
  resetToken: () => {
    set({ ...initialState });
  },
});

export const useUserToken = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
