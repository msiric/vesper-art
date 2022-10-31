import create from "zustand";
import { getUser } from "../../services/user";
import { resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  profile: {
    data: {},
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  editable: false,
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchProfile: async ({ userUsername, userId }) => {
    try {
      const { data } = await getUser.request({ userUsername });
      set((state) => ({
        ...state,
        profile: {
          data: data.user,
          loading: false,
          error: { ...initialState.profile.error },
        },
        editable: userId === data.user.id,
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        profile: {
          ...state.profile,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  resetProfile: () => {
    set({ ...initialState });
  },
});

export const useUserProfile = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
