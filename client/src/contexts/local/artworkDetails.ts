import create from "zustand";
import { getDetails } from "../../services/artwork";
import { postDownload } from "../../services/checkout";
import { displayValidLicense } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: { owner: {}, current: { cover: {} } },
    loading: true,
    error: false,
  },
  license: null,
  modal: {
    open: false,
  },
  tabs: {
    value: 0,
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchArtwork: async ({ artworkId }) => {
    const { data } = await getDetails.request({
      artworkId,
    });
    set((state) => ({
      ...state,
      artwork: { data: data.artwork, loading: false, error: false },
      license: displayValidLicense(
        data.artwork.current.use,
        data.artwork.current.license
      ),
    }));
  },
  downloadArtwork: async ({ versionId, values }) => {
    try {
      await postDownload.request({
        versionId,
        data: values,
      });
      set((state) => ({
        ...state,
        modal: {
          ...state.modal,
          open: false,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
  purchaseArtwork: ({ history, versionId, license }) => {
    history.push({
      pathname: `/checkout/${versionId}`,
      state: {
        license,
      },
    });
  },
  openModal: () => {
    set((state) => ({
      ...state,
      modal: {
        ...state.modal,
        open: true,
      },
    }));
  },
  closeModal: () => {
    set((state) => ({
      ...state,
      modal: {
        ...state.modal,
        open: false,
      },
    }));
  },
  changeTab: ({ index }) => {
    set((state) => ({
      ...state,
      tabs: { ...state.tabs, value: index },
    }));
  },
  resetArtwork: () => {
    set({ ...initialState });
  },
});

export const useArtworkDetails = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
