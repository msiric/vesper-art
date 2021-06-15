import create from "zustand";
import { getSearch } from "../../services/home";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: [],
    loading: true,
    hasMore: true,
    cursor: "",
    limit: 50,
    error: { retry: false, message: "" },
  },
  users: {
    data: [],
    loading: true,
    hasMore: true,
    cursor: "",
    limit: 50,
    error: { retry: false, message: "" },
  },
  type: null,
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchResults: async ({ query, type }) => {
    try {
      const cursor = get()[type].cursor;
      const limit = get()[type].limit;
      const { data } = await getSearch.request({
        searchQuery: query,
        cursor,
        limit,
      });
      set((state) => ({
        ...state,
        [type]: {
          ...state[type],
          data: [...state[type].data, ...data.searchData],
          hasMore: data.searchData.length < state[type].limit ? false : true,
          cursor: resolvePaginationId(data.searchData),
          loading: false,
          error: { ...initialState[type].error },
        },
      }));
    } catch (err) {
      console.log(err);
      set((state) => ({
        [type]: {
          ...state[type],
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  resetResults: () => {
    set({ ...initialState });
  },
});

export const useSearchResults = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
