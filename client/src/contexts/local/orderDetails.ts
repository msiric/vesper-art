import create from "zustand";
import { getDownload, getOrder, postReview } from "../../services/orders";
import { resolveAsyncError, scrollToHighlight } from "../../utils/helpers";

export const initialState = {
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

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchOrder: async ({ userId, orderId, query, highlightRef }) => {
    try {
      const { data } = await getOrder.request({
        userId,
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
  downloadArtwork: async ({ userId, orderId }) => {
    try {
      const { data } = await getDownload.request({ userId, orderId });
      const link = document.createElement("a");
      link.href = data.url;
      link.setAttribute("download", data.file);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
  },
  submitRating: async ({ userId, orderId, values }) => {
    try {
      await postReview.request({
        userId,
        orderId,
        reviewRating: values.reviewRating,
      });
      const order = get().order.data;
      const newRating = order.seller.rating
        ? (
            (order.seller.rating * order.seller.reviews.length +
              values.reviewRating) /
            (order.seller.reviews.length + 1)
          ).toFixed(2)
        : values.reviewRating.toFixed(2);
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
              rating: values.reviewRating,
            },
          },
        },
        modal: {
          ...state.modal,
          open: false,
        },
      }));
    } catch (err) {
      const error = err as string;
      throw new Error(error);
    }
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
