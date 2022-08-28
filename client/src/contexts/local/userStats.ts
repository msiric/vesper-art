import { eachDayOfInterval, format, subDays } from "date-fns";
import create from "zustand";
import { getDashboard } from "../../services/stripe";
import { getSelection, getStatistics } from "../../services/user";
import { resolveAsyncError } from "../../utils/helpers";

export const initialState = {
  graphData: [
    {
      date: null,
      pl: 0,
      cl: 0,
    },
  ],
  aggregateStats: {
    data: {},
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  selectedStats: {
    data: { licenses: {} },
    loading: true,
    error: { retry: false, redirect: false, message: "" },
  },
  display: {
    type: "purchases",
    label: "spent",
  },
  redirecting: false,
  range: [new Date(subDays(new Date(), 7)), new Date()],
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  fetchAggregateStats: async ({ userId, display }) => {
    try {
      const { data } = await getStatistics.request({
        userId,
        display: display.type,
      });
      const aggregateStats = {
        rating:
          data.reviews && data.reviews.length
            ? data.reviews.reduce((a, b) => a + b.rating, 0) /
              data.reviews.length
            : 0,
        favorites: data.favorites ? data.favorites.length : 0,
        orders: data[display.type].length,
        [display.label]: data[display.type].length
          ? data[display.type].reduce((a, b) => a + b[display.label], 0)
          : 0,
      };
      set((state) => ({
        ...state,
        aggregateStats: {
          ...state.aggregateStats,
          data: aggregateStats,
          loading: false,
          error: { ...initialState.aggregateStats.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        aggregateStats: {
          ...state.aggregateStats,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  fetchSelectedData: async ({ userId, display, dateFrom, dateTo }) => {
    try {
      const { data } = await getSelection.request({
        userId,
        displayType: display.type,
        start: dateFrom,
        end: dateTo,
      });
      const selectedStats = {
        [display.label]: data.statistics.length
          ? data.statistics.reduce((a, b) => a + b[display.label], 0)
          : 0,
        licenses: {
          personal: 0,
          commercial: 0,
        },
      };
      const datesArray = eachDayOfInterval({
        start: new Date(dateFrom),
        end: new Date(dateTo),
      });
      const graphData = {};
      for (const date of datesArray) {
        graphData[format(date, "dd/MM/yyyy")] = {
          pl: 0,
          cl: 0,
        };
      }
      data.statistics.forEach((item) => {
        const formattedDate = format(new Date(item.created), "dd/MM/yyyy");
        if (item.license.type === "personal") {
          selectedStats.licenses.personal++;
          if (graphData[formattedDate]) {
            graphData[formattedDate] = {
              ...graphData[formattedDate],
              pl: graphData[formattedDate].pl + 1,
            };
          } else {
            graphData[formattedDate] = {
              date: formattedDate,
              pl: 1,
            };
          }
        } else {
          selectedStats.licenses.commercial++;
          if (graphData[formattedDate]) {
            graphData[formattedDate] = {
              ...graphData[formattedDate],
              cl: graphData[formattedDate].cl + 1,
            };
          } else {
            graphData[formattedDate] = {
              date: formattedDate,
              cl: 1,
            };
          }
        }
      });
      const formattedGraphData = Object.entries(graphData).map((item: any) => ({
        date: item[0],
        pl: item[1].pl,
        cl: item[1].cl,
      }));
      set((state) => ({
        ...state,
        graphData: formattedGraphData,
        selectedStats: {
          data: { ...selectedStats },
          loading: false,
          error: { ...initialState.selectedStats.error },
        },
      }));
    } catch (err) {
      set((state) => ({
        ...state,
        selectedStats: {
          ...state.selectedStats,
          loading: false,
          error: resolveAsyncError(err),
        },
      }));
    }
  },
  changeSelection: ({ selection }) => {
    set((state) => ({
      ...state,
      aggregateStats: {
        data: [],
        loading: true,
        error: { ...initialState.aggregateStats.error },
      },
      selectedStats: {
        data: { licenses: {} },
        loading: true,
        error: { ...initialState.selectedStats.error },
      },
      display: {
        type: selection,
        label: selection === "purchases" ? "spent" : "earned",
      },
    }));
  },
  changeRange: ({ range }) => {
    set((state) => ({
      ...state,
      selectedStats: {
        ...state.selectedStats,
        data: { licenses: {} },
        loading: true,
        error: { ...initialState.selectedStats.error },
      },
      range,
    }));
  },
  redirectDashboard: async ({ stripeId }) => {
    set((state) => ({
      ...state,
      redirecting: true,
    }));
    await getDashboard.request({
      stripeId,
    });
    set((state) => ({
      ...state,
      redirecting: false,
    }));
  },
  resetStats: () => {
    set({ ...initialState });
  },
});

export const useUserStats = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
