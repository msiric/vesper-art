import create from "zustand";
import { getSearch } from "../../services/home";
import { resolvePaginationId } from "../../utils/helpers";

const initialState = {
  artwork: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 50,
  },
  users: {
    data: [],
    loading: true,
    error: false,
    hasMore: true,
    cursor: "",
    limit: 50,
  },
  type: null,
};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  fetchResults: async ({ query, type }) => {
    try {
      set({ ...initialState });
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
          error: false,
        },
      }));
    } catch (err) {
      console.log(err);
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
