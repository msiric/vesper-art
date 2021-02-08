import create from "zustand";
import { getOrders } from "../../services/orders";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  orders: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 10,
  },
  display: "purchases",
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchOrders: async ({ display }) => {
    const { data } = await getOrders.request({
      display,
    });
    set((state) => ({
      ...state,
      orders: {
        ...state.artwork,
        data: [...state.orders.data, ...data[display]],
        loading: false,
        error: false,
        hasMore: data[display].length < state.orders.limit ? false : true,
        cursor: resolvePaginationId(data[display]),
      },
    }));
  },
  changeSelection: ({ selection }) => {
    set((state) => ({
      ...state,
      orders: { ...state.orders, data: [], loading: true, error: false },
      display: selection,
    }));
  },
  resetOrders: () => {
    set({ ...initialState });
  },
});

export const useUserOrders = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
