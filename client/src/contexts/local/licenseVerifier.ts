import create from "zustand";
import { postVerifier } from "../../services/home";
import { resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  license: {
    data: false,
    loading: false,
    error: { retry: false, redirect: false, message: "" },
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchLicense: async (values) => {
    try {
      set((state) => ({
        ...state,
        license: {
          ...state.license,
          error: { ...initialState.license.error },
        },
      }));
      const { data } = await postVerifier.request({ data: values });
      set((state) => ({
        ...state,
        license: {
          ...state.license,
          data: data.license,
          loading: false,
          error: { ...initialState.license.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        license: { data: {}, loading: false, error: resolveAsyncError(err) },
      }));
    }
  },
  resetToken: () => {
    set({ ...initialState });
  },
});

export const useLicenseVerifier = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
