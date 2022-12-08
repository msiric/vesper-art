import create from "zustand";
import {
  deleteUser,
  getSettings,
  patchEmail,
  patchPassword,
  patchPreferences,
  patchUser,
} from "../../services/user";
import { resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  user: {
    data: {},
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  modal: {
    open: false,
  },
  isDeactivating: false,
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchSettings: async ({ userId }) => {
    try {
      const { data } = await getSettings.request({
        userId,
      });
      set((state) => ({
        ...state,
        user: {
          data: data.user,
          loading: false,
          error: { ...initialState.user.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  updateProfile: async ({ userId, values }) => {
    try {
      const formData = new FormData();
      for (const value of Object.keys(values)) {
        formData.append(value, values[value]);
      }
      await patchUser.request({
        userId,
        data: formData,
      });
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          data: {
            ...state.user.data,
            avatar: values.userMedia,
            description: values.userDescription,
            country: values.userCountry,
          },
          loading: false,
          error: false,
        },
      }));
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  updateEmail: async ({ userId, values, handleLogout }) => {
    try {
      // $TODO Log user out server side
      await patchEmail.request({
        userId,
        data: values,
      });
      await handleLogout();
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  updatePreferences: async ({ userId, values }) => {
    try {
      await patchPreferences.request({
        userId,
        data: values,
      });
      set((state) => ({
        ...state,
        user: {
          ...state.user,
          data: {
            ...state.user.data,
            displayFavorites: values.userFavorites,
          },
          loading: false,
          error: false,
        },
      }));
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  updatePassword: async ({ userId, values, handleLogout }) => {
    try {
      await patchPassword.request({
        userId,
        data: values,
      });
      await handleLogout();
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  deactivateUser: async ({ userId }) => {
    try {
      set((state) => ({ ...state, isDeactivating: true }));
      await deleteUser.request({ userId });
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    } finally {
      set((state) => ({ ...state, isDeactivating: false }));
    }
  },
  toggleModal: () => {
    set((state) => ({
      ...state,
      modal: { ...state.modal, open: !state.modal.open },
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
