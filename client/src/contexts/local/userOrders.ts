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
  fetchOrders: async () => {
    set((state) => ({
      ...state,
      orders: { ...state.orders, loading: true, error: false },
    }));
    const display = get().display;
    const { data } = await getOrders.request({
      display,
    });
    set((state) => ({
      ...state,
      orders: {
        ...state.artwork,
        data: [...state.orders.data, ...data.orders],
        loading: false,
        error: false,
        hasMore: data.orders.length < state.orders.limit ? false : true,
        cursor: resolvePaginationId(data.orders),
      },
    }));
  },
  changeSelection: (selection) => {
    set((state) => ({
      ...state,
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
