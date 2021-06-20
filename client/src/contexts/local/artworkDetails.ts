import create from "zustand";
import { renderFreeLicenses } from "../../../../common/helpers";
import { getDetails } from "../../services/artwork";
import { postDownload } from "../../services/checkout";
import { resolveAsyncError } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: { owner: {}, current: { cover: {}, media: {} } },
    loading: true,
    error: { retry: false, redirect: false, message: "" },
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
    try {
      const { data } = await getDetails.request({
        artworkId,
      });
      const availableLicenses = renderFreeLicenses({
        version: data.artwork.current,
      });
      const selectedLicense = availableLicenses[availableLicenses.length - 1];
      set((state) => ({
        ...state,
        artwork: {
          data: data.artwork,
          loading: false,
          error: { ...initialState.artwork.error },
        },
        license: selectedLicense && selectedLicense.value,
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        artwork: {
          ...state.artwork,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
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
  toggleFavorite: async ({ incrementBy }) => {
    set((state) => ({
      ...state,
      artwork: {
        ...state.artwork,
        data: {
          ...state.artwork.data,
          favorites: state.artwork.data.favorites + incrementBy,
        },
      },
    }));
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
