import create from "zustand";
import { getDownload, getOrder, postReview } from "../../services/orders.js";
import { resolveAsyncError } from "../../utils/helpers.js";

const initialState = {
  order: {
    data: {
      artwork: {},
      version: { cover: {} },
      seller: {},
      buyer: {},
      license: {},
      review: {},
    },
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  modal: {
    open: false,
  },
};

const scrollToHighlight = (highlightRef) => {
  if (highlightRef.current)
    highlightRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchOrder: async ({ orderId, query, highlightRef }) => {
    try {
      const { data } = await getOrder.request({
        orderId,
      });
      set((state) => ({
        ...state,
        order: {
          data: data.order,
          loading: false,
          error: { ...initialState.order.error },
        },
      }));
      if (query && query.notif === "review") {
        scrollToHighlight(highlightRef);
      }
    } catch (err) {
      set((state) => ({
        ...state,
        order: {
          ...state.order,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  downloadArtwork: async ({ orderId }) => {
    const { data } = await getDownload.request({ orderId });
    const link = document.createElement("a");
    link.href = data.url;
    link.setAttribute("download", data.file);
    document.body.appendChild(link);
    link.click();
  },
  submitRating: async ({ orderId, userId, values }) => {
    await postReview.request({
      orderId,
      reviewRating: values.artistRating,
    });
    const order = get().order.data;
    const newRating = order.seller.rating
      ? (
          (order.seller.rating * order.seller.reviews.length +
            values.artistRating) /
          (order.seller.reviews.length + 1)
        ).toFixed(2)
      : order.seller.rating;
    set((state) => ({
      ...state,
      order: {
        ...state.order,
        data: {
          ...state.order.data,
          seller: {
            ...state.order.data.seller,
            rating: newRating,
          },
          review: {
            order: order.id,
            artwork: order.artwork.id,
            owner: userId,
            rating: values.artistRating,
          },
        },
      },
      modal: {
        ...state.modal,
        open: false,
      },
    }));
  },
  toggleModal: () => {
    set((state) => ({
      ...state,
      modal: { ...state.modal, open: !state.modal.open },
    }));
  },
  resetOrder: () => {
    set({ ...initialState });
  },
});

export const useOrderDetails = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));