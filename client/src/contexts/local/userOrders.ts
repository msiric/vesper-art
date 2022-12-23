import create from "zustand";
import { getOrders } from "../../services/orders";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

export const SUPPORTED_ORDERS_DISPLAYS = [
  { value: "purchases", text: "Purchases" },
  { value: "sales", text: "Sales" },
];

export const initialState = {
  purchases: {
    data: [],
    loading: true,
    hasMore: false,
    cursor: "",
    limit: 10,
    error: { retry: false, redirect: false, message: "" },
  },
  sales: {
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
  fetchOrders: async ({ userId }) => {
    set((state) => ({
      ...state,
      [state.display]: {
        ...state[state.display],
        loading: !state[state.display].initialized,
        fetching: state[state.display].initialized,
        error: {
          ...initialState[state.display].error,
        },
      },
    }));
    try {
      const display = get().display;
      const { data } = await getOrders.request({
        userId,
        display,
      });
      set((state) => ({
        ...state,
        [display]: {
          ...state[display],
          data: [...state[display].data, ...data[display]],
          loading: false,
          error: { ...initialState[display].error },
          hasMore: data[display].length < state[display].limit ? false : true,
          cursor: resolvePaginationId(data[display]),
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        [state.display]: {
          ...state[state.display],
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  changeSelection: ({ selection = SUPPORTED_ORDERS_DISPLAYS[0] }) => {
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
