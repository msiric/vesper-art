import create from "zustand";
import { getDownload } from "../../services/orders";
import { getMedia, getOwnership, getUploads } from "../../services/user";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: {},
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
  },
  purchases: {
    data: {},
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
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
  fetching: false,
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchUser: async ({ userId, userUsername, formatArtwork }) => {
    try {
      set((state) => ({
        ...initialState,
        display: state.display,
      }));
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
        fetching: true,
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
          fetching: false,
          index,
        }));
        image.onload = null;
        image = null;
      };
    }
  },
  changeSelection: (e) => {
    set((state) => ({
      ...state,
      display: e.target.value,
      index: null,
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
