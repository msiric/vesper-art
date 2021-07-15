import create from "zustand";
import { getOwnership, getUploads } from "../../services/user";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: {},
    loading: true,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 10,
    error: {
      refetch: false,
      message: "",
    },
  },
  purchases: {
    data: {},
    loading: true,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 10,
    error: {
      refetch: false,
      message: "",
    },
  },
  elements: [],
  captions: [],
  display: "purchases",
  // display: {
  //   type: "purchases",
  //   label: "spent",
  // },
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchUser: async ({ userId, userUsername, formatArtwork }) => {
    try {
      const display = get().display;
      const artwork = get().artwork;
      const purchases = get().purchases;
      const { data } =
        display === "purchases"
          ? await getOwnership.request({
              userId,
              cursor: purchases.cursor,
              limit: purchases.limit,
            })
          : await getUploads.request({
              userId,
              cursor: artwork.cursor,
              limit: artwork.limit,
            });
      const newArtwork = data[display].reduce((object, item) => {
        object[
          display === "purchases"
            ? item.version.cover.source
            : item.current.cover.source
        ] = {
          id: item.id,
          title:
            display === "purchases" ? item.version.title : item.current.title,
          owner: display === "purchases" ? item.seller.name : userUsername,
          cover:
            display === "purchases"
              ? item.version.cover.source
              : item.current.cover.source,
          media:
            display === "purchases"
              ? item.version.media.source
              : item.current.media.source,
          dominant:
            display === "purchases"
              ? item.version.cover.dominant
              : item.current.cover.dominant,
          height:
            display === "purchases"
              ? item.version.cover.height
              : item.current.cover.height,
          width:
            display === "purchases"
              ? item.version.cover.width
              : item.current.cover.width,
        };
        return object;
      }, {});
      const formattedArtwork = formatArtwork(newArtwork);
      set((state) => ({
        ...state,
        [display]: {
          ...state[display],
          data: { ...state[display].data, ...newArtwork },
          loading: false,
          fetching: false,
          initialized: true,
          error: { ...initialState[display].error },
          hasMore: data[display].length < state[display].limit ? false : true,
          cursor: resolvePaginationId(data[display]),
        },
        elements: formattedArtwork.elements,
        captions: formattedArtwork.captions,
      }));
    } catch (err) {
      console.log(err);
      set((state) => ({ ...state, loading: false }));
      set((state) => ({
        ...state,
        [state[state.display]]: {
          ...state[state.display],
          initialized: true,
          loading: false,
          fetching: false,
          error: resolveAsyncError(err, true),
        },
      }));
    }
  },
  changeSelection: ({ selection }) => {
    set(() => ({
      ...initialState,
      display: selection,
    }));
  },
  resetGallery: () => {
    set({ ...initialState });
  },
});

export const useUserGallery = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
