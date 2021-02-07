import create from "zustand";
import { getOrder } from "../../services/orders.js";

const initialState = {
  order: {
    data: {
      version: { cover: {} },
      seller: {},
      buyer: {},
      license: {},
      review: {},
    },
    loading: true,
    error: false,
  },
  modal: {
    open: false,
  },
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchOrder: async ({ orderId }) => {
    const { data } = await getOrder.request({
      orderId,
    });
    set((state) => ({
      ...state,
      order: { data: data.order, loading: false, error: false },
    }));
  },
  resetOrder: () => {
    set({ ...initialState });
  },
});

export const useOrderDetails = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
