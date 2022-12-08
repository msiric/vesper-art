import create from "zustand";
import { getOrders } from "../../services/orders";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

export const initialState = {
  orders: {
    data: [],
    loading: true,
    hasMore: false,
    cursor: "",
    limit: 10,
    error: { retry: false, redirect: false, message: "" },
  },
  display: "purchases",
};

const initState = () => ({ ...initialState });

const initActions = (set, get) => ({
  fetchOrders: async ({ userId, display }) => {
    try {
      const { data } = await getOrders.request({
        userId,
        display,
      });
      set((state) => ({
        ...state,
        orders: {
          ...state.artwork,
          data: [...state.orders.data, ...data[display]],
          loading: false,
          error: { ...initialState.orders.error },
          hasMore: data[display].length < state.orders.limit ? false : true,
          cursor: resolvePaginationId(data[display]),
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        orders: {
          ...state.orders,
          loading: false,
          error: resolveAsyncError(err),
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
  resetOrders: () => {
    set({ ...initialState });
  },
});

export const useUserOrders = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
