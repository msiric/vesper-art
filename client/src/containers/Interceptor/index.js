import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef } from "react";
import openSocket from "socket.io-client";
import useSound from "use-sound";
import { auth } from "../../../../common/constants";
import App from "../../App";
import notificationSound from "../../assets/sounds/notification-sound.wav";
import Backdrop from "../../components/Backdrop";
import { useAppStore } from "../../contexts/global/app";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import { postRefresh } from "../../services/auth";
import history from "../../utils/history";

const ax = axios.create();
export const socket = { instance: null };

const Interceptor = () => {
  const theme = useAppStore((state) => state.theme);
  const loading = useAppStore((state) => state.loading);
  const setApp = useAppStore((state) => state.setApp);

  const userId = useUserStore((state) => state.id);
  const userToken = useUserStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const resetUser = useUserStore((state) => state.resetUser);

  const initialized = useEventsStore(
    (state) => state.notifications.initialized
  );
  const count = useEventsStore((state) => state.notifications.count);
  const updatedCount = useEventsStore(
    (state) => state.notifications.updatedCount
  );
  const isUpdating = useEventsStore((state) => state.notifications.isUpdating);
  const updateCount = useEventsStore((state) => state.updateCount);
  const refreshNotifications = useEventsStore(
    (state) => state.refreshNotifications
  );
  const disconnectMenu = useEventsStore((state) => state.disconnectMenu);
  const setEvents = useEventsStore((state) => state.setEvents);
  const updateEvents = useEventsStore((state) => state.updateEvents);
  const addNotification = useEventsStore((state) => state.addNotification);

  const notificationState = useRef({ count: 0, shouldUpdate: true });

  const [playNotification] = useSound(notificationSound);

  const { enqueueSnackbar } = useSnackbar();

  const handleAuthError = () => {
    resetUser();
    if (history) history.push("/login");
  };

  const handleSocketNotification = (data) => {
    return addNotification({
      notification: data,
      cursor: data.id,
    });
  };

  const handleSocketRefresh = async () => {
    try {
      if (socket?.instance) socket.instance.emit("disconnectUser");
      const { data } = await postRefresh.request();
      updateUser({
        token: data.accessToken,
        email: data.user.email,
        avatar: data.user.avatar,
        stripeId: data.user.stripeId,
        onboarded: data.user.onboarded,
        country: data.user.country,
        favorites: data.user.favorites.reduce(
          (object, item) => ({ ...object, [item.artworkId]: true }),
          {}
        ),
      });
      updateEvents({
        notifications: { count: data.user.notifications },
      });
    } catch (err) {
      disconnectMenu();
    }
  };

  const handleNotificationRefresh = async () => {
    if (initialized) {
      await refreshNotifications({ userId });
    }
  };

  const handleSocket = (token) => {
    if (token) {
      socket.instance = openSocket();
      socket.instance.emit("authenticateUser", {
        token: token ? `Bearer ${token}` : null,
      });
      socket.instance.on("sendNotification", handleSocketNotification);
      socket.instance.on("expiredToken", handleSocketRefresh);
      socket.instance.on("connect", handleNotificationRefresh);
    } else if (socket?.instance) {
      socket.instance.emit("disconnectUser");
    }
  };

  const getRefreshToken = async () => {
    try {
      if (!userToken) {
        setApp({ loading: true, error: false, theme });
        const { data } = await postRefresh.request();
        if (data.user) {
          setUser({
            authenticated: true,
            token: data.accessToken,
            id: data.user.id,
            name: data.user.name,
            fullName: data.user.fullName,
            email: data.user.email,
            avatar: data.user.avatar,
            stripeId: data.user.stripeId,
            onboarded: data.user.onboarded,
            country: data.user.country,
            favorites: data.user.favorites.reduce(
              (object, item) => ({ ...object, [item.artworkId]: true }),
              {}
            ),
          });
          setEvents({
            notifications: {
              count: data.user.notifications,
            },
          });
          updateCount({ enabled: true });
        }
        setApp({ loading: false, error: false, theme });
      }
    } catch (err) {
      setApp({ loading: false, error: err, theme });
    }
  };

  const interceptTraffic = (token) => {
    if (token) {
      ax.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete ax.defaults.headers.common.Authorization;
    }

    ax.interceptors.response.use(
      (response) => {
        if (response?.data?.redirect) {
          window.location.href = response.data.redirect;
        }
        if (response?.data?.expose) {
          enqueueSnackbar(response.data.message, {
            variant: "success",
          });
        }
        return Promise.resolve(response);
      },
      async (error) => {
        if (error?.response?.data?.message === auth.loginMessage) {
          if (history) history.push("/login");
          return Promise.reject(error);
        }
        if (error?.response?.config?.url === auth.refreshEndpoint) {
          handleAuthError();
          return Promise.reject(error);
        }
        if (error?.response?.status === 401) {
          if (socket?.instance) socket.instance.emit("disconnectUser");
          const { data } = await postRefresh.request();
          updateUser({
            token: data.accessToken,
            email: data.user.email,
            avatar: data.user.avatar,
            stripeId: data.user.stripeId,
            onboarded: data.user.onboarded,
            country: data.user.country,
            favorites: data.user.favorites.reduce(
              (object, item) => ({ ...object, [item.artworkId]: true }),
              {}
            ),
          });
          updateEvents({
            notifications: { count: data.user.notifications },
          });
          const { config } = error;
          config._retry = true;
          config.headers.Authorization = `Bearer ${data.accessToken}`;

          return ax(config);
        }
        if (error?.response?.status !== 401) {
          if (error?.response?.data?.expose) {
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
            });
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
    handleSocket(token);
  };

  useEffect(() => {
    getRefreshToken();
    return () => {
      if (socket?.instance) {
        socket.instance.off("sendNotification", handleSocketNotification);
        socket.instance.off("expiredToken", handleSocketRefresh);
        socket.instance.off("connect", handleNotificationRefresh);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    interceptTraffic(userToken);
    return () => {
      axios.interceptors.request.eject(ax);
      axios.interceptors.response.eject(ax);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  useEffect(() => {
    if (updatedCount) {
      if (
        notificationState.current.shouldUpdate &&
        count > notificationState.current.count
      ) {
        playNotification();
      }
    }
    if (isUpdating) notificationState.current.shouldUpdate = false;
    else notificationState.current.shouldUpdate = true;
    notificationState.current.count = count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, isUpdating]);

  return loading ? <Backdrop loading={loading} /> : <App />;
};

export { ax };
export default Interceptor;
