import create from "zustand";
import { getDownload } from "../../services/orders";
import { getMedia, getOwnership, getUploads } from "../../services/user";
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
  covers: [],
  media: [],
  captions: [],
  index: null,
  display: "purchases",
  // display: {
  //   type: "purchases",
  //   label: "spent",
  // },
  isDownloading: false,
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
          media: null,
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
        covers: formattedArtwork.covers,
        media: formattedArtwork.media,
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
  toggleGallery: async ({
    userId,
    item,
    index,
    openLightbox,
    formatArtwork,
  }) => {
    const covers = get().covers;
    const display = get().display;
    const selection = get()[display].data;
    const foundMedia = item.media && covers[index].media === item.media;
    const identifier = selection[item.cover].id;
    if (foundMedia) {
      set((state) => ({
        ...state,
        index,
      }));
      openLightbox(index);
    } else {
      set((state) => ({
        ...state,
        isDownloading: true,
        index,
      }));
      const { data } =
        display === "purchases"
          ? await getDownload.request({ orderId: identifier })
          : await getMedia.request({
              userId,
              artworkId: identifier,
            });
      let image: any = new Image();
      image.src = data.url;
      image.onload = () => {
        const newArtwork = {
          ...selection,
          [item.cover]: {
            ...selection[item.cover],
            media: data.url,
          },
        };
        const formattedArtwork = formatArtwork(newArtwork);
        set((state) => ({
          ...state,
          [display]: { ...state[display], data: newArtwork },
          covers: formattedArtwork.covers,
          media: formattedArtwork.media,
          captions: formattedArtwork.captions,
          isDownloading: false,
          index,
        }));
        image.onload = null;
        image = null;
      };
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
