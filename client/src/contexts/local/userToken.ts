import create from "zustand";
import { getToken } from "../../services/auth";
import { resolveAsyncError } from "../../utils/helpers";

const initialState = {
  token: {
    data: false,
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchToken: async ({ tokenId }) => {
    try {
      await getToken.request({ tokenId });
      set((state) => ({
        ...state,
        token: {
          data: true,
          loading: false,
          error: { ...initialState.token.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        token: {
          ...state.token,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  resetToken: () => {
    set({ ...initialState });
  },
});

export const useUserToken = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
