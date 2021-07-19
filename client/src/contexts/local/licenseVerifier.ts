import create from "zustand";
import { postVerifier } from "../../services/home";
import { resolveAsyncError } from "../../utils/helpers";

const initialState = {
  license: {
    data: false,
    loading: false,
    error: { retry: false, redirect: false, message: "" },
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchLicense: async ({ licenseData }) => {
    try {
      set((state) => ({
        ...state,
        license: {
          ...state.license,
          loading: true,
          error: { ...initialState.license.error },
        },
      }));
      const { data } = await postVerifier.request({ data: licenseData });
      set((state) => ({
        ...state,
        license: { ...state.license, data: data.license, loading: false },
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
