import { subDays } from "date-fns";
import create from "zustand";

const initialState = {
  graphData: { data: false, loading: true, error: false },
  aggregateStats: { data: false, loading: true, error: false },
  selectedStats: { data: false, loading: true, error: false },
  display: {
    type: "purchases",
    label: "spent",
  },
  dates: [new Date(subDays(new Date(), 7)), new Date()],
  visualization: false,
};

const initState = () => ({ ...initialState });

const initActions = (set) => ({
  resetStats: () => {
    set({ ...initialState });
  },
});

export const useUserStats = create((set) => ({
  ...initState(),
  ...initActions(set),
}));
