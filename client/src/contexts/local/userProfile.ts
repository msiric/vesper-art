import create from "zustand";
import { getUser } from "../../services/user";

const initialState = {
  profile: { data: {}, loading: true, error: false },
  editable: false,
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchProfile: async ({ userUsername, userId }) => {
    const { data } = await getUser.request({ userUsername });
    set((state) => ({
      ...state,
      profile: { data: data.user, loading: false, error: false },
      editable: userId === data.user.id,
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
