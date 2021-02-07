import create from "zustand";
import { getUser } from "../../services/user";

const initialState = {
  profile: { data: {}, loading: true, error: false },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchProfile: async ({ userUsername, cursor, limit }) => {
    const { data } = await getUser.request({ userUsername, cursor, limit });
    set((state) => ({
      ...state,
      profile: { data: data.user, loading: false, error: false },
    }));
  },
  resetProfile: () => {
    set({ ...initialState });
  },
});

export const useUserProfile = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
