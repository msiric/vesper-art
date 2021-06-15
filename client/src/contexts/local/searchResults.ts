import create from "zustand";
import { getSearch } from "../../services/home";
import { resolveAsyncError, resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: [],
    loading: true,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 50,
    error: { refetch: false, message: "" },
  },
  users: {
    data: [],
    loading: true,
    fetching: false,
    initialized: false,
    hasMore: true,
    cursor: "",
    limit: 50,
    error: { refetch: false, message: "" },
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
          fetching: false,
          initialized: true,
          error: { ...initialState[type].error },
        },
      }));
    } catch (err) {
      set((state) => ({
        [type]: {
          ...state[type],
          initialized: true,
          loading: false,
          fetching: false,
          error: resolveAsyncError(err, true),
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
