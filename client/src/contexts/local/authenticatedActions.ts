import create from "zustand";
import { postLogout } from "../../services/user";

const initialState = {};

const initState = () => ({
  ...initialState,
});

const initActions = (set, get) => ({
  unauthenticateUser: async ({
    socket,
    resetUser,
    resetEvents,
    handleMenuClose,
    history,
  }) => {
    await postLogout.request();
    socket.instance.emit("disconnectUser");
    resetUser();
    resetEvents();
    handleMenuClose();

    history.push("/login");
  },
  resetActions: () => {
    set({ ...initialState });
  },
});

export const useHeaderActions = create((set, get) => ({
  ...initState(),
  ...initActions(set, get),
}));
