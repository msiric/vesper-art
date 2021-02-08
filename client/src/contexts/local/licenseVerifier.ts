import create from "zustand";
import { postVerifier } from "../../services/home";

const initialState = {
  license: { data: false, loading: true, error: false },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchLicense: async ({ licenseData }) => {
    const { data } = await postVerifier.request({ licenseData });
    set((state) => ({
      ...state,
      license: { data: data.license, loading: false, error: false },
    }));
  },
  resetToken: () => {
    set({ ...initialState });
  },
});

export const useLicenseVerifier = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
